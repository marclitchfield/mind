import * as resolve from '../query';

export const Location = () => ({
  post_location_of_collection: resolve.entityMerge('Location', 'AT', 'Collection', 'IN'),
  post_described_by_concept: resolve.entityMerge('Location', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_timeline_of_event: resolve.entityMerge('Location', 'TIMELINE', 'Event', 'OUT'),
  post_subject_of_idea: resolve.entityMerge('Location', 'SUBJECT', 'Idea', 'IN'),
  post_location_of_item: resolve.entityMerge('Location', 'AT', 'Item', 'IN'),
  post_super_location: resolve.entityMerge('Location', 'SUB', 'Location', 'OUT'),
  post_sub_location: resolve.entityMerge('Location', 'SUB', 'Location', 'IN'),
  post_location_of_person: resolve.entityMerge('Location', 'AT', 'Person', 'OUT'),
  post_in_space: resolve.entityMerge('Location', 'CONTAINS', 'Space', 'IN', { inheritSpace: false }),
});