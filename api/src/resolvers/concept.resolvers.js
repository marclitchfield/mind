import { resolveEntityMerge, resolveCypher } from '../query';

export const Concept = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (s)-[:CONTAINS {root:true}]->(c:Concept {id: $id})
  `, 'c'),
  createSub: resolveEntityMerge(`
    MATCH (sc:Concept {id: $superConceptId})<-[:CONTAINS]-(s:Space) WITH s, sc
    MERGE (sc)-[:SUB]->(c:Concept {id: $id})<-[:CONTAINS]-(s)  
  `, 'c'),
  connectSub: resolveCypher(`
    MATCH (sup:Concept {id: $superConceptId}), (sub:Concept {id: $subConceptId})
    MERGE (sup)-[:SUB]->(sub)
  `),
  disconnectSub: resolveCypher(`
    MATCH (sup:Concept {id: $superConceptId})-[r:SUB]->(sub:Concept {id: $subConceptId})
    DELETE r
  `)
})