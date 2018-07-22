import * as resolve from '../query';

export const Item = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:INSTANCE_OF]->(c)
  `, 'i'),
  createInstance: resolve.entityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:INSTANCE_OF]->(c)
  `, 'i'),
  createLinkForIdea: resolve.entityMerge(`
    MATCH (id:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH id, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:LINKS_TO]-(id)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createSubjectForIdea: resolve.entityMerge(`
    MATCH (id:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH id, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:SUBJECT]-(id)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createInContainer: resolve.entityMerge(`
    MATCH (ic:Item {id: $containerItemId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH ic, s, c
    MERGE (ic)-[:CONTAINS]->(i:Item {id: $id})<-[:CONTAINS]-(s)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createAtLocation: resolve.entityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH loc, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})-[:AT]->(loc)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createWithinCollection: resolve.entityMerge(`
    MATCH (col:Collection {id: $collectionId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH col, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:CONTAINS]-(col)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),
  createForPerson: resolve.entityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH p, s, c
    MERGE (s)-[:CONTAINS]->(i:Item {id: $id})<-[:HAS]-(p)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'i'),

  addEvent: resolve.addRelationship('Item', 'TIMELINE', 'Event', '$eventId'),
  addItem: resolve.addRelationship('Item', 'CONTAINS', 'Item', '$itemId'),
  setLocation: resolve.setRelationship('Item', 'AT', 'Location', '$locationId'),
  setClass: resolve.setRelationship('Item', 'INSTANCE_OF', 'Concept', '$classConceptId'),

  removeEvent: resolve.removeRelationship('Item', 'TIMELINE', 'Event', '$eventId'),
  removeItem: resolve.removeRelationship('Item', 'CONTAINS', 'Item', '$itemId'),
  clearLocation: resolve.clearRelationship('Item', 'AT', 'Location')
});