import { resolveEntityMerge, resolveCypher } from '../query';

export const Mind = () => ({
  create: resolveEntityMerge('MERGE (m:Mind {id: $id})', 'm')
});