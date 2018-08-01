const uuid = require('uuid/v4');

export const entityMerge = (entityType, relationship, sourceType, direction, options) => async(args, context) => {
  const {beforeMerge, instance, cardinality, inheritSpace, relationshipProperties} = options || {};

  const entityCypher = buildEntityCypher(entityType, sourceType, inheritSpace);
  const instanceCypher = buildInstanceCypher(instance);
  const cardinalityCypher = buildCardinalityCypher(relationship, sourceType, direction, cardinality);
  const sourceMerge = buildSourceMerge(relationship, direction, relationshipProperties);

  const mergeStatement = [
    entityCypher,
    instanceCypher,
    cardinalityCypher,
    sourceMerge,
  ].filter(statement => statement).join('\n');

  return cypherMerge(mergeStatement, {beforeMerge})(args, context);
}

export const cypherMerge = (mergeStatement, {beforeMerge} = {}) => async(args, context) => {
  const props = Object.assign({}, args.input, { id: args.input.id || uuid()});
  if (beforeMerge !== undefined) {
    beforeMerge(props);
  }
  const removeStatement = props.remove ? 'DELETE source_rel WITH entity, source' : '';
  const propertyKeys = Object.keys(props || {}).filter(prop => !['sourceId', 'classId', 'remove'].includes(prop));
  const assignments = propertyKeys.map(key => `entity.${key} = $${key}`).join(', ');
  const upsertStatement = assignments.length > 0
    ? `ON MATCH SET ${assignments} ON CREATE SET ${assignments}, entity.created = timestamp()`
    : `ON CREATE SET entity.created = timestamp()`
  const returnStatement = `RETURN entity, apoc.date.format(entity.created) AS created`;  

  const cypher = [
    mergeStatement,
    upsertStatement,
    removeStatement,
    returnStatement
  ].join('\n');


  const session = context.driver.session();
  const result = await session.run(cypher, props);
  const record = result.records[0];
  return Object.assign({}, record.get('entity').properties, { created: record.get('created') });
}

export const runCypher = (cypher, {beforeCypher} = {}) => async(args, context) => {
  const props = Object.assign({}, args);
  if (beforeCypher !== undefined) {
    beforeCypher(props);
  }
  const session = context.driver.session();
  await session.run(cypher, props);
}



function buildEntityCypher(entityType, sourceType, inheritSpace) {
  if (inheritSpace === false) {
    return `MATCH (source:${sourceType} {id: $sourceId})
            MERGE (entity:${entityType} {id: $id}) WITH entity, source`;
  }
  return `MATCH (space:Space)-[:CONTAINS]->(source:${sourceType} {id: $sourceId})
          MERGE (space)-[:CONTAINS]->(entity:${entityType} {id: $id}) WITH entity, source`;
}

function buildInstanceCypher(instance) {
  if (!instance) {
    return '';
  }
  return `MATCH (class:Concept {id: $classId})
          MERGE (entity)-[:INSTANCE_OF]->(class) WITH entity, source`;
}

function buildCardinalityCypher(relationship, sourceType, direction, cardinality) {
  if (cardinality !== 1) {
    return '';
  }
  const match = {
    'IN': `OPTIONAL MATCH (entity)<-[r:${relationship}]-(:${sourceType})`,
    'OUT': `OPTIONAL MATCH (entity)-[r:${relationship}]->(:${sourceType})`
  }[direction];
  return match + ' DELETE r WITH entity, source'
}


function buildSourceMerge(relationship, direction, relationshipProperties) {
  const properties = relationshipProperties === undefined ? '' : 
    '{'+Object.keys(relationshipProperties).map(key => key + ':' + JSON.stringify(relationshipProperties[key])).join(',')+'}';

  return {
    'IN': `MERGE (entity)<-[source_rel:${relationship} ${properties}]-(source)`,
    'OUT': `MERGE (entity)-[source_rel:${relationship} ${properties}]->(source)`
  }[direction];
}