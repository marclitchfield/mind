import * as resolve from '../query';

export const Organization = () => ({
  post_having_ability: resolve.entityMerge('Organization', 'HAS', 'Ability', 'OUT'),
  post_having_collection: resolve.entityMerge('Organization', 'HAS', 'Collection', 'OUT'),
  post_having_item: resolve.entityMerge('Organization', 'HAS', 'Item', 'OUT'),
  post_containing_person: resolve.entityMerge('Organization', 'CONTAINS', 'Person', 'OUT'),
  post_having_objective: resolve.entityMerge('Organization', 'HAS', 'Objective', 'OUT'),
  post_in_organization: resolve.entityMerge('Organization', 'CONTAINS', 'Organization', 'IN'),
  post_containing_organization: resolve.entityMerge('Organization', 'CONTAINS', 'Organization', 'OUT'),
  post_in_space: resolve.entityMerge('Organization', 'CONTAINS', 'Space', 'IN')
});
