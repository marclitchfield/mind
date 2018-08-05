import * as resolve from '../query';

export const Ability = () => ({
  post_required_by_ability: resolve.entityMerge('Ability', 'REQUIRES', 'Ability', 'IN'),
  post_requires_ability: resolve.entityMerge('Ability', 'REQUIRES', 'Ability', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Ability', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_for_item: resolve.entityMerge('Ability', 'HAS', 'Item', 'IN'),
  post_for_person: resolve.entityMerge('Ability', 'HAS', 'Person', 'IN'),
  post_required_by_objective: resolve.entityMerge('Ability', 'REQUIRES', 'Objective', 'IN'),
  post_requires_objective: resolve.entityMerge('Ability', 'REQUIRES', 'Objective', 'OUT'),
  post_in_space: resolve.entityMerge('Ability', 'CONTAINS', 'Space', 'IN', { inheritSpace: false })
});
