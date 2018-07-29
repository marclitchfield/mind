import * as resolve from '../query';

export const spec = {
  Collection: {name: 'HAS', direction: 'OUT'},
  Concept: {name: 'DESCRIBED_BY', direction: 'OUT'},
  Event: {name: 'TIMELINE', direction: 'OUT'},
  Idea: {name: 'SUBJECT', direction: 'IN'},
  Items: {name: 'CONTAINS', direction: 'OUT'},
  Location: {name: 'AT', direction: 'OUT'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Person = () => ({
  post: resolve.entityMerge('Idea', spec),
  add: resolve.addRelationship('Idea', spec),
  remove: resolve.removeRelationship('Idea', spec),

  createUnion: resolve.runCypher(`
    MATCH (p1:Person {id: $person1}), (p2:Person {id: $person2}), (e:Event {id: $eventId})
    MERGE (p1)-[:PART_OF]->(u:Union {datetime: e.datetime})<-[:PART_OF]-(p2)
    MERGE (u)-[:UNION]->(e)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `),
  createOffspring: resolve.runCypher(`
    MATCH (p1:Person {id: $parent1}), (p2:Person {id: $parent2}), (c:Person {id: $childId}), (e:Event {id: $eventId})
    MERGE (p1)-[:PARENT_OF]->(o:Offspring {datetime: e.datetime})<-[:PARENT_OF]-(p2)
    MERGE (o)-[:CHILD]->(c) 
    MERGE (o)-[:BIRTH]->(e)<-[:TIMELINE]-(c)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `)
});