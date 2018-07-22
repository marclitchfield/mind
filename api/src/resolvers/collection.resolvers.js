import { resolveEntityMerge, resolveCypher } from '../query';

export const Collection = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col'),
  createInstance: resolveEntityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col'),
  createForPerson: resolveEntityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH p, s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:HAS]->(col)
    MERGE (p)-[:INSTANCE_OF]->(c)
  `, 'col'),
  createAtLocation: resolveEntityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH loc, s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:AT]->(loc)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'col'),  
});