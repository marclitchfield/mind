import * as resolve from '../query';

export const Idea = () => ({
  createInSpace: resolve.entityMerge(`
      MATCH (s:Space {id: $spaceId}) WITH s
      MERGE (s)-[:CONTAINS]->(i:Idea {id: $id})
    `, 'i'),
  createForConcept: resolve.entityMerge(`
      MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
      MERGE (s)-[:CONTAINS]-(i:Idea {id: $id})-[:RELATES_TO]->(c)
    `, 'i'),
  createResponse: resolve.entityMerge(`
      MATCH (p:Idea {id: $contextIdeaId})<-[:CONTAINS]-(s:Space) WITH p, s
      MERGE (p)-[:RESPONSE]->(r:Idea {id: $id})<-[:CONTAINS]-(s)
    `, 'r'),

  addEvent: resolve.addRelationship('Idea', 'CONTAINS', 'Event', '$eventId'),
  addConcept: resolve.addRelationship('Idea', 'RELATES_TO', 'Concept', '$conceptId'),
  addReesponse: resolve.addRelationship('Idea', 'RESPONSE', 'Idea', '$responseIdeaId'),
  addLinkedItem: resolve.addRelationship('Idea', 'LINKS_TO', 'Item', '$linkedItemId'),
  addSubjectItem: resolve.addRelationship('Idea', 'SUBJECT', 'Item', '$subjectItemId'),
  addSourcePerson: resolve.addRelationship('Idea', 'SOURCE', 'Person', '$sourcePersonId'),
  addSubjectPerson: resolve.addRelationship('Idea', 'SUBJECT', 'Person', '$subjectPersonId'),
  
  removeEvent: resolve.removeRelationship('Idea', 'CONTAINS', 'Event', '$eventId'),
  removeConcept: resolve.removeRelationship('Idea', 'RELATES_TO', 'Concept', '$conceptId'),
  removeResponse: resolve.removeRelationship('Idea', 'RESPONSE', 'Idea', '$responseIdeaId'),
  removeLinkedItem: resolve.removeRelationship('Idea', 'LINKS_TO', 'Item', '$linkedItemId'),
  removeSubjectItem: resolve.removeRelationship('Idea', 'SUBJECT', 'Item', '$subjectItemId'),
  removeSourcePerson: resolve.removeRelationship('Idea', 'SOURCE', 'Person', '$sourcePersonId'),
  removeSubjectPerson: resolve.removeRelationship('Idea', 'SUBJECT', 'Person', '$subjectPersonId')
});