import * as resolve from '../query';

export const Person = () => ({
  post_having_ability: resolve.entityMerge('Person', 'HAS', 'Ability', 'OUT'),
  post_having_collection: resolve.entityMerge('Person', 'HAS', 'Collection', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Person', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_timeline_of_event: resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT'),
  post_source_of_idea: resolve.entityMerge('Person', 'SOURCE_OF', 'Idea', 'OUT'),
  post_subject_of_idea: resolve.entityMerge('Person', 'SUBJECT', 'Idea', 'IN'),
  post_having_item: resolve.entityMerge('Person', 'HAS', 'Item', 'OUT'),
  post_at_location: resolve.entityMerge('Person', 'AT', 'Location', 'OUT', { cardinality: 1 }),
  post_having_objective: resolve.entityMerge('Person', 'HAS', 'Objective', 'OUT'),
  post_in_organization: resolve.entityMerge('Person', 'CONTAINS', 'Organization', 'IN'),
  post_in_space: resolve.entityMerge('Person', 'CONTAINS', 'Space', 'IN', { inheritSpace: false }),
});