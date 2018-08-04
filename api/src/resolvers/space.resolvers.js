import * as resolve from '../query';

export const Space = () => ({
  post_in_mind: resolve.entityMerge('Space', 'CONTAINS', 'Mind', 'IN', { inheritSpace: false }),
  post_super_space: resolve.entityMerge('Space', 'CONTAINS', 'Space', 'OUT', { inheritSpace: false }),
  post_sub_space: resolve.entityMerge('Space', 'CONTAINS', 'Space', 'IN', { inheritSpace: false }),
  destroy: resolve.runCypher('MATCH (s:Space {id: $id})-[*1..3]->(n) DETACH DELETE s, n')
});
