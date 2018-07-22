import { resolveEntityMerge, resolveCypher } from '../query';

export const Person = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createForConcept: resolveEntityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (c)-[:CONTAINS]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createForPositionSource: resolveEntityMerge(`
    MATCH (sp:Position {id: $positionId})<-[:CONTAINS]-(s:Space) WITH sp, s
    MERGE (sp)-[:SOURCE]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createForPositionSubject: resolveEntityMerge(`
    MATCH (sp:Position {id: $positionId})<-[:CONTAINS]-(s:Space) WITH sp, s
    MERGE (sp)-[:SUBJECT]->(p:Person {id: $id})<-[:CONTAINS]-(s)
  `, 'p'),
  createUnion: resolveCypher(`
    MATCH (p1:Person {id: $person1}), (p2:Person {id: $person2}), (e:Event {id: $eventId})
    MERGE (p1)-[:PART_OF]->(u:Union {datetime: e.datetime})<-[:PART_OF]-(p2)
    MERGE (u)-[:UNION]->(e)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `),
  createOffspring: resolveCypher(`
    MATCH (p1:Person {id: $parent1}), (p2:Person {id: $parent2}), (c:Person {id: $childId}), (e:Event {id: $eventId})
    MERGE (p1)-[:PARENT_OF]->(o:Offspring {datetime: e.datetime})<-[:PARENT_OF]-(p2)
    MERGE (o)-[:CHILD]->(c) 
    MERGE (o)-[:BIRTH]->(e)<-[:TIMELINE]-(c)
    MERGE (p1)-[:TIMELINE]->(e)<-[:TIMELINE]-(p2)
  `)
});