import * as resolve from '../query';

export const Objective = () => ({
  post_required_by_ability: resolve.entityMerge('Objective', 'REQUIRES', 'Ability', 'IN'),
  post_requires_ability: resolve.entityMerge('Objective', 'REQUIRES', 'Ability', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Objective', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_for_item: resolve.entityMerge('Objective', 'HAS', 'Item', 'IN'),
  post_required_by_objective: resolve.entityMerge('Objective', 'REQUIRES', 'Objective', 'IN'),
  post_requires_objective: resolve.entityMerge('Objective', 'REQUIRES', 'Objective', 'OUT'),
  post_for_person: resolve.entityMerge('Objective', 'HAS', 'Person', 'IN'),
  post_in_space: resolve.entityMerge('Objective', 'CONTAINS', 'Space', 'IN', { inheritSpace: false })
});
