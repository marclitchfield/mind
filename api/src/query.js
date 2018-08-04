const uuid = require('uuid/v4');
require('colors');

const DEBUG = false;

const wellKnownProps = ['sourceId', 'classId', 'remove'];

export const entityMerge = (entityType, relationship, sourceType, direction, options) => async(args, context) => {
  const {beforeMerge, instance, cardinality, inheritSpace, relationshipProperties} = options || {};

  const mergeStatement = [
    buildEntityCypher(entityType, sourceType, inheritSpace),
    buildInstanceCypher(instance),
    buildCardinalityCypher(relationship, sourceType, direction, cardinality),
    buildSourceMerge(relationship, direction, relationshipProperties)
  ].filter(statement => statement).join('\n');

  return await cypherMerge(mergeStatement, {beforeMerge})(args, context);
}

export const cypherMerge = (mergeStatement, {beforeMerge} = {}) => async(args, context) => {
  const props = Object.assign({}, args.input, { id: args.input.id || uuid()});
  const removeStatement = props.remove ? 'DELETE source_rel WITH entity, source' : '';
  if (beforeMerge !== undefined) {
    beforeMerge(props);
  }
  const propertyKeys = Object.keys(props || {}).filter(prop => 
    !wellKnownProps.includes(prop) && props[prop] !== undefined);
  const assignments = propertyKeys.map(key => 
    `entity.${key} = $${key}`).join(', ');
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

  return await runCypher(cypher)(props, context);
}

export const runCypher = (cypher) => async(args, context) => {
  const session = context.driver.session();

  if (DEBUG) {
    console.log(('[cypher] ' + cypher).blue);
    console.log(('[params] ' + JSON.stringify(args)).green);
  }

  const result = await session.run(cypher, args);
  const record = result.records[0];
  const response = record && Object.assign({},
    record.keys.includes('entity') && record.get('entity').properties, 
    record.keys.includes('created') && { created: record.get('created') });

  if (DEBUG) {
    console.log(('[result] ' + JSON.stringify(response || '')).magenta);
  }
  return response;
}

function buildEntityCypher(entityType, sourceType, inheritSpace) {
  if (inheritSpace === false) {
    return `MATCH (source:${sourceType} {id: $sourceId})
            MERGE (entity:${entityType}:Entity {id: $id}) WITH entity, source`;
  }
  return `MATCH (space:Space)-[:CONTAINS]->(source:${sourceType} {id: $sourceId})
          MERGE (space)-[:CONTAINS]->(entity:${entityType}:Entity {id: $id}) WITH entity, source`;
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