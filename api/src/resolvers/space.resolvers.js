import * as resolve from '../query';

const spec = {
  Mind: {name: 'CONTAINS', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'OUT'}
};

export const Space = () => ({
  post_in_mind: resolve.entityMerge('Space', 'CONTAINS', 'Mind', 'IN'),
  post_super_space: resolve.entityMerge('Space', 'CONTAINS', 'Space', 'OUT'),
  post_sub_space: resolve.entityMerge('Space', 'CONTAINS', 'Space', 'IN'),
  destroy: resolve.runCypher('MATCH (s:Space {id: $id})-[*1..3]->(n) DETACH DELETE s, n')
});
