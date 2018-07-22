import * as resolve from '../query';

export const Collection = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}), (c:Concept {id: $classConceptId}) WITH s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col'),
  createInstance: resolve.entityMerge(`
    MATCH (c:Concept {id: $classConceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:INSTANCE_OF]->(c)
  `, 'col'),
  createForPerson: resolve.entityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH p, s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:HAS]->(col)
    MERGE (p)-[:INSTANCE_OF]->(c)
  `, 'col'),
  createAtLocation: resolve.entityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space), (c:Concept {id: $classConceptId}) WITH loc, s, c
    MERGE (s)-[:CONTAINS]->(col:Collection {id: $id})-[:AT]->(loc)
    MERGE (i)-[:INSTANCE_OF]->(c)
  `, 'col'),

  addEvent: resolve.addRelationship('Collection', 'TIMELINE', 'Event', '$eventId'),
  setLocation: resolve.setRelationship('Collection', 'AT', 'Location', '$locationId'),
  setClass: resolve.setRelationship('Collection', 'INSTANCE_OF', 'Concept', '$classConceptId'),
  
  removeEvent: resolve.removeRelationship('Colleciton', 'TIMELINE', 'Event', '$eventId'),
  clearLocation: resolve.clearRelationship('Colleciton', 'AT', 'Location')
});