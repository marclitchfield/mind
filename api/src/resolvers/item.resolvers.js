import { resolveEntityMerge, resolveCypher } from '../query';

export const Item = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:INSTANCE_OF]->(c)
  `, 'i'),
  createInstance: resolveEntityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:INSTANCE_OF]->(c)
  `, 'i'),
  createLinkForIdea: resolveEntityMerge(`
    MATCH (id:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH id, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:LINKS_TO]-(id)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createSubjectForIdea: resolveEntityMerge(`
    MATCH (id:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH id, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:SUBJECT]-(id)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createInContainer: resolveEntityMerge(`
    MATCH (ic:Item {id: $containerItemId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH ic, s, c
    MERGE (ic)-[:CONTAINS]->(i:Item {id: $id})<-[:CONTAINS]-(s)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createAtLocation: resolveEntityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH loc, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:AT]->(loc)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createWithinCollection: resolveEntityMerge(`
    MATCH (col:Collection {id: $collectionId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH col, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:CONTAINS]-(col)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createForPerson: resolveEntityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH p, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:HAS]-(p)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i')  
});