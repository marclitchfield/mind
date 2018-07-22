const uuid = require('uuid/v4');

export const entityMerge = (cypher, alias, preprocess) => async(args, context, info) => {
  const session = context.driver.session();
  const props = Object.assign({}, args, {
    id: args.id || uuid()
  });
  if (preprocess) {
    preprocess(props);
  }
  const sets = Object.keys(props.input || {}).map(key => `${alias}.${key} = $input.${key}`).join(', ');
  const result = await session.run(`
    ${cypher}
    ON MATCH SET ${sets}
    ON CREATE SET ${sets}, ${alias}.created = timestamp()
    RETURN ${alias} AS result, apoc.date.format(${alias}.created) AS created
  `, props);
  const record = result.records[0];
  return Object.assign({}, record.get('result').properties, { created: record.get('created') });
}

export const cypher = (cypher, preprocess) => async(args, context) => {
  const props = Object.assign({}, args);
  if (preprocess) {
    preprocess(props);
  }
  const session = context.driver.session();
  await session.run(cypher, props);
}

export const addRelationship = (subject, predicate, object, objectKey) => async(args, context) => {
  await resolveCypher(`
    MATCH (sub:${subject} {id: $id}), (obj:${object} {id: ${objectKey}})
    MERGE (sub)-[:${predicate}]->(obj)
  `, );
}

export const removeRelationship = (subject, predicate, object, objectKey) => async(args, context) => {
  await resolveCypher(`
    MATCH (sub:${subject} {id: $id})-[r:${predicate}]->(obj:${object} {id: ${objectKey}})
    DELETE r
  `)
}

export const setRelationship = (subject, predicate, object, objectKey) => async(args, context) => {
  await resolveCypher(`
    MATCH (sub:${subject} {id: $id})-[r:${predicate}]->(obj:${object})
    DELETE r
    MERGE (sub)-[:${predicate}]->(${object} { id: ${objectKey} })
  `);
}

export const clearRelationship = (subject, predicate, object) => async(args, context) => {
  await resolveCypher(`
    MATCH (sub:${subject} {id: $id})-[r:${predicate}]->(obj:${object})
    DELETE r
  `);
}
