import * as resolve from '../query';

const spec = {
  Mind: {name: 'CONTAINS', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'OUT'}
};

export const Space = () => ({
  post: resolve.entityMerge('Space', spec),
  add: resolve.addRelationship('Space', spec),
  remove: resolve.removeRelationship('Space', spec),
  destroy: resolve.runCypher('MATCH (s:Space {id: $id})-[*1..3]->(n) DETACH DELETE s, n')
});
