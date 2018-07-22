import { resolveEntityMerge, resolveCypher } from '../query';

export const Collection = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col'),
  createInstance: resolveEntityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col')
});