import * as resolve from '../query';

export const Space = () => ({
  createInMind: resolve.entityMerge(`
    MATCH (m:Mind {id: $mindId}) WITH m
    MERGE (m)-[:CONTAINS]->(s:Space {id: $id})
`, 's'),

  addCollection: resolve.addRelationship('Space', 'CONTAINS', 'Collection', '$collectionId'),
  addConcept: resolve.addRelationship('Space', 'CONTAINS', 'Concept', '$conceptId'),
  addEvent: resolve.addRelationship('Space', 'CONTAINS', 'Event', '$eventId'),
  addIdea: resolve.addRelationship('Space', 'CONTAINS', 'Idea', '$ideaId'),
  addItem: resolve.addRelationship('Space', 'CONTAINS', 'Item', '$itemId'),
  addLocation: resolve.addRelationship('Space', 'CONTAINS', 'Location', '$locationId'),
  addPerson: resolve.addRelationship('Space', 'CONTAINS', 'Person', '$personId'),

  removeCollection: resolve.removeRelationship('Space', 'CONTAINS', 'Collection', '$collectionId'),
  removeConcept: resolve.removeRelationship('Space', 'CONTAINS', 'Concept', '$conceptId'),
  removeEvent: resolve.removeRelationship('Space', 'CONTAINS', 'Event', '$eventId'),
  removeIdea: resolve.removeRelationship('Space', 'CONTAINS', 'Idea', '$ideaId'),
  removeItem: resolve.removeRelationship('Space', 'CONTAINS', 'Item', '$itemId'),
  removeLocation: resolve.removeRelationship('Space', 'CONTAINS', 'Location', '$locationId'),
  removePerson: resolve.removeRelationship('Space', 'CONTAINS', 'Person', '$personId')
});
