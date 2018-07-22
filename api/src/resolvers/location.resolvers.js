import { resolveEntityMerge, resolveCypher } from '../query';

export const Location = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (loc:Location {id: $id})<-[:CONTAINS]-(s)
  `, 'loc'),
  createForConcept: resolveEntityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(loc:Location {id: $id})-[:CONTAINS]->(c)
  `, 'loc'),
  createWithinLocation: resolveEntityMerge(`
    MATCH (ol:Location {id: $outerLocationId})<-[:CONTAINS]-(s:Space) WITH ol, s
    MERGE (s)-[:CONTAINS]->(il:Location {id: $id})<-[:IN]-(ol)
  `, 'il')
});