import { resolveEntityMerge, resolveCypher } from '../query';

export const Idea = () => ({
  createInSpace: resolveEntityMerge(`
      MATCH (s:Space {id: $spaceId}) WITH s
      MERGE (s)-[:CONTAINS]->(i:Idea {id: $id})
    `, 'i'),
  createForConcept: resolveEntityMerge(`
      MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
      MERGE (s)-[:CONTAINS]-(i:Idea {id: $id})-[:RELATES_TO]->(c)
    `, 'i'),
  createResponse: resolveEntityMerge(`
      MATCH (p:Idea {id: $contextIdeaId})<-[:CONTAINS]-(s:Space) WITH p, s
      MERGE (p)-[:RESPONSE]->(r:Idea {id: $id})<-[:CONTAINS]-(s)
    `, 'r')
});