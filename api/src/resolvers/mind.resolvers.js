import * as resolve from '../query';

export const Mind = () => ({
  post: resolve.cypherMerge('MERGE (entity:Mind {id: $id})'),
  destroy: resolve.runCypher('MATCH (m:Mind {id: $id})-->(s:Space)-[*0..3]->(n) DETACH DELETE m,s,n')
});