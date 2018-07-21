import { resolveEntityMerge, resolveCypher } from '../query';

export const Space = () => ({
  createInMind: resolveEntityMerge(`
    MATCH (m:Mind {id: $mindId}) WITH m
    MERGE (m)-[:CONTAINS]->(s:Space {id: $id})
`, 's')
});
