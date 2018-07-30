import * as resolve from '../query';

export const Person = () => ({
  post_having_collection: resolve.entityMerge('Person', 'HAS', 'Collection', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Person', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_timeline_of_event: resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT'),
  post_subject_of_idea: resolve.entityMerge('Person', 'SUBJECT', 'Idea', 'IN'),
  post_having_item: resolve.entityMerge('Person', 'HAS', 'Item', 'OUT'),
  post_at_location: resolve.entityMerge('Person', 'AT', 'Location', 'OUT', { cardinality: 1 }),
  post_in_space: resolve.entityMerge('Person', 'CONTAINS', 'Space', 'IN'),

  post_union: resolve.runCypher(`
    MATCH (p1:Person {id: $person1}), (p2:Person {id: $person2}), (e:Event {id: $eventId})
    MERGE (p1)-[:PART_OF]->(u:Union {datetime: e.datetime})<-[:PART_OF]-(p2)
    MERGE (u)-[:UNION]->(e)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `),
  post_offspring: resolve.runCypher(`
    MATCH (p1:Person {id: $parent1}), (p2:Person {id: $parent2}), (c:Person {id: $childId}), (e:Event {id: $eventId})
    MERGE (p1)-[:PARENT_OF]->(o:Offspring {datetime: e.datetime})<-[:PARENT_OF]-(p2)
    MERGE (o)-[:CHILD]->(c) 
    MERGE (o)-[:BIRTH]->(e)<-[:TIMELINE]-(c)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `)
});