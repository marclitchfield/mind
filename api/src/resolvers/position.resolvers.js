import { resolveEntityMerge, resolveCypher } from '../query';

export const Position = () => ({
  createForConcept: resolveEntityMerge(`
      MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
      MERGE (c)<-[:CONTAINS]-(p:Position {id: $id})<-[:CONTAINS]-(s)
    `, 'p'),
  createResponse: resolveEntityMerge(`
      MATCH (p:Position {id: $contextPositionId})<-[:CONTAINS]-(s:Space) WITH p, s
      MERGE (p)-[:RESPONSE]->(r:Position {id: $id})<-[:CONTAINS]-(s)
    `, 'r')
});