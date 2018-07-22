import * as resolve from '../query';

export const Mind = () => ({
  create: resolve.entityMerge('MERGE (m:Mind {id: $id})', 'm'),
  addSpace: resolve.addRelationship('Mind', 'CONTAINS', 'Space', '$spaceId'),
  removeSpace: resolve.removeRelationship('Mind', 'CONTAINS', 'Space', '$spaceId')
});