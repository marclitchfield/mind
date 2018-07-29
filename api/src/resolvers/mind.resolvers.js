import * as resolve from '../query';

const spec = {
  Space: {name: 'CONTAINS', direction: 'OUT'}
};

export const Mind = () => ({
  post: resolve.cypherMerge('MERGE (entity:Mind {id: $id})'),
  add: resolve.addRelationship('Mind', spec),
  remove: resolve.removeRelationship('Mind', spec),
  destroy: resolve.runCypher('MATCH (m:Mind {id: $id})-->(s:Space)-[*0..3]->(n) DETACH DELETE m,s,n')
});