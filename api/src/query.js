const uuid = require('uuid/v4');

export const entityMerge = (entityType, relationship, sourceType, direction, options) => async(args, context) => {
  const {beforeMerge, instance, cardinality, inheritSpace, properties} = options || {};

  const entityMerge = inheritSpace === false 
    ? `MATCH (source:${sourceType} {id: $sourceId}) 
       MERGE (entity:${entityType} {id: $id})` 
    : `MATCH (space:Space)-[:CONTAINS]->(source:${sourceType} {id: $sourceId})
       MERGE (space)-[:CONTAINS]->(entity:${entityType} {id: $id})`;
  const sourceMerge = {
    'IN': `MERGE (entity)<-[:${relationship}]-(source)`,
    'OUT': `MERGE (entity)-[:${relationship}]->(source)`
  }[direction];

  const mergeStatement = [
    entityMerge,
    sourceMerge
  ].join('\n');
  return cypherMerge(mergeStatement, {beforeMerge})(args, context);
}

// export const entityMerge2 = (entityType, spec, {beforeMerge, instance} = {}) => async(args, context) => {
//   const sourceType = await queryType(context, args.sourceId);
//   const sourceSpec = spec[sourceType];

//   const contextMatch = sourceType === 'Space' 
//   ? `MATCH (space:Space {id: $sourceId})`
//   : `MATCH (space:Space)-[:CONTAINS]->(source:${sourceType} {id: $sourceId})`;

//   const instanceMatch = instance ? `MATCH (class:Concept {id: $classId})` : '';
//   const entityMerge = `MERGE (space)-[:CONTAINS]->(entity:${entityType} {id: $id})`;
//   const sourceMerge = {
//     'IN': `MERGE (entity)<-[:${sourceSpec.name}]-(source)`,
//     'OUT': `MERGE (entity)-[:${sourceSpec.name}]->(source)`
//   }[sourceSpec.direction];
  
//   const instanceMerge = instance ? `MERGE (entity)-[:INSTANCE_OF]->(class)` : '';

//   const mergeStatement = [
//     contextMatch,
//     instanceMatch,
//     entityMerge,
//     sourceMerge,
//     instanceMerge,
//   ].join('\n');
//   return cypherMerge(mergeStatement, {beforeMerge})(args, context);
// }

export const cypherMerge = (mergeStatement, {beforeMerge} = {}) => async(args, context) => {
  const props = Object.assign({}, args.input, { id: args.input.id || uuid()});
  if (beforeMerge !== undefined) {
    beforeMerge(props);
  }
  const propertyKeys = Object.keys(props || {}).filter(prop => !['sourceId', 'classId'].includes(prop));
  const assignments = propertyKeys.map(key => `entity.${key} = $${key}`).join(', ');
  const upsertStatement = assignments.length > 0
    ? `ON MATCH SET ${assignments} ON CREATE SET ${assignments}, entity.created = timestamp()`
    : `ON CREATE SET entity.created = timestamp()`
  const returnStatement = `RETURN entity, apoc.date.format(entity.created) AS created`;  

  const cypher = [
    mergeStatement,
    upsertStatement,
    returnStatement
  ].join('\n');

  const session = context.driver.session();
  const result = await session.run(cypher, props);
  const record = result.records[0];
  return Object.assign({}, record.get('entity').properties, { created: record.get('created') });
}

export const addRelationship = (entityType, spec) => async(args, context) => {
  const targetType = await queryType(context, args.targetId);
  const targetSpec = spec[targetType];
  const targetMerge = {
    'IN': `MERGE (entity)<-[:${targetSpec.name}]-(source)`,
    'OUT': `MERGE (entity)-[:${targetSpec.name}]->(source)`
  }[targetSpec.direction];
  await cypher(`
    MATCH (entity:${entityType} {id: $id}), (target:${targetType} {id: $targetId})
    ${targetMerge}
  `, )(args, context);
}

export const removeRelationship = (entityType, spec) => async(args, context) => {
  const targetType = await queryType(context, args.targetId);
  const targetSpec = spec[targetType];
  const targetMatch = {
    'IN': `MATCH (entity:${entityType} {id: $id})<-[r:${targetSpec.name}]-(target:${targetType} {id: $targetId})`,
    'OUT': `MATCH (entity:${entityType} {id: $id})-[r:${targetSpec.name}]->(target:${targetType} {id: $targetId})`
  }[targetSpec.direction];
  await cypher(`${targetMatch} DELETE r`, )(args, context);
}

export const setRelationship = (entityType, spec) => async(args, context) => {
  const targetType = await queryType(context, args.targetId);
  const targetSpec = spec[targetType];
  const targetMatch = {
    'IN': `MATCH (entity:${entityType} {id: $id})-[r:${targetSpec.name}]->(target:${targetType} {id: $targetId})`,
    'OUT': `MATCH (entity:${entityType} {id: $id})<-[r:${targetSpec.name}]-(target:${targetType} {id: $targetId})`
  }[targetSpec.direction];
  const deleteStatement = 'DELETE r';
  const targetMerge = {
    'IN': `MERGE (entity)<-[:${targetSpec.name}]-(target)`,
    'OUT': `MERGE (entity)-[:${targetSpec.name}]->(target)`
  }[targetSpec.direction];

  const cypher = [
    targetMatch, 
    deleteStatement, 
    targetMerge
  ].join('\n');

  await runCypher(cypher)(args, context);    
}

export const runCypher = (cypher, {beforeCypher} = {}) => async(args, context) => {
  const props = Object.assign({}, args);
  if (beforeCypher !== undefined) {
    beforeCypher(props);
  }
  const session = context.driver.session();
  await session.run(cypher, props);
}

async function queryType(context, id) { 
  const session = context.driver.session();
  const queryResult = await session.run("MATCH (n {id:$id}) RETURN LABELS(n)[0] AS type", { id });
  return queryResult.records[0].get('type');
}
