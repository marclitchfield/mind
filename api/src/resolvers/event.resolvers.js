import { resolveEntityMerge, resolveCypher } from '../query';

export const Event = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})
  `, 'e'),
  createForConcept: resolveEntityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (c)<-[:CONTAINS]-(e:Event {id: $id})<-[:CONTAINS]-(s)
  `, 'e')
});