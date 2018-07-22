import * as resolve from '../query';

export const Person = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createForConcept: resolve.entityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (c)-[:CONTAINS]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createAsIdeaSource: resolve.entityMerge(`
    MATCH (si:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space) WITH si, s
    MERGE (si)-[:SOURCE]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createAsIdeaSubject: resolve.entityMerge(`
    MATCH (sp:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space) WITH sp, s
    MERGE (sp)-[:SUBJECT]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createAtLocation: resolve.entityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space) WITH loc, s
    MERGE (s)-[:CONTAINS]->(p:Person {id: $id})-[:AT]->(loc)
  `, 'p'),
  createUnion: resolve.cypher(`
    MATCH (p1:Person {id: $person1}), (p2:Person {id: $person2}), (e:Event {id: $eventId})
    MERGE (p1)-[:PART_OF]->(u:Union {datetime: e.datetime})<-[:PART_OF]-(p2)
    MERGE (u)-[:UNION]->(e)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `),
  createOffspring: resolve.cypher(`
    MATCH (p1:Person {id: $parent1}), (p2:Person {id: $parent2}), (c:Person {id: $childId}), (e:Event {id: $eventId})
    MERGE (p1)-[:PARENT_OF]->(o:Offspring {datetime: e.datetime})<-[:PARENT_OF]-(p2)
    MERGE (o)-[:CHILD]->(c) 
    MERGE (o)-[:BIRTH]->(e)<-[:TIMELINE]-(c)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `),

  addItem: resolve.addRelationship('Person', 'HAS', 'Item', '$itemId'),
  addCollection: resolve.addRelationship('Person', 'HAS', 'Collection', '$collectionId'),
  setLocation: resolve.setRelationship('Person', 'AT', 'Location', '$locationId'),

  removeItem: resolve.removeRelationship('Person', 'HAS', 'Item', '$itemId'),
  removeCollection: resolve.removeRelationship('Person', 'HAS', 'Collection', '$collectionId'),
  clearLocation: resolve.clearRelationship('Person', 'AT', 'Location')
});