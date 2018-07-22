import { resolveEntityMerge, resolveCypher } from '../query';

export const Item = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:CLASS_OF]->(c)
  `, 'i'),
  createForConcept: resolveEntityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:CLASS_OF]->(c)
  `, 'i'),
  createLinkForIdea: resolveEntityMerge(`
    MATCH (id:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH id, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:LINKS_TO]-(id)
    MERGE (i)-[:CLASS_OF]->(c)
  `, 'i'),
  createInContainer: resolveEntityMerge(`
    MATCH (ic:Item {id: $containerItemId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH ic, s, c
    MERGE (ic)-[:CONTAINS]->(i:Item {id: $id})<-[:CONTAINS]-(s)
    MERGE (i)-[:CLASS_OF]->(c)
  `, 'i')
});