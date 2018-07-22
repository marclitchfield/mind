import * as resolve from '../query';

export const Location = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (loc:Location {id: $id})<-[:CONTAINS]-(s)
  `, 'loc'),
  createForConcept: resolve.entityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(loc:Location {id: $id})-[:CONTAINS]->(c)
  `, 'loc'),
  createWithinLocation: resolve.entityMerge(`
    MATCH (ol:Location {id: $outerLocationId})<-[:CONTAINS]-(s:Space) WITH ol, s
    MERGE (s)-[:CONTAINS]->(il:Location {id: $id})<-[:IN]-(ol)
  `, 'il'),

  addConcept: resolve.addRelationship('Location', 'CONTAINS', 'Concept', '$conceptId'),
  addLocation: resolve.addRelationship('Location', 'CONTAINS', 'Location', '$locationId'),
  
  removeConcept: resolve.removeRelationship('Location', 'CONTAINS', 'Concept', '$conceptId'),
  removeLocation: resolve.removeRelationship('Location', 'CONTAINS', 'Location', '$locationId')
});