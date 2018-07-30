import * as resolve from '../query';

export const Idea = () => ({
  post_about_collection: resolve.entityMerge('Idea', 'SUBJECT', 'Collection', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Idea', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_about_event: resolve.entityMerge('Idea', 'SUBJECT', 'Event', 'OUT'),
  post_super_idea: resolve.entityMerge('Idea', 'SUB', 'Idea', 'IN'),
  post_sub_idea: resolve.entityMerge('Idea', 'SUB', 'Idea', 'OUT'),
  post_about_item: resolve.entityMerge('Idea', 'SUBJECT', 'Item', 'OUT'),
  post_about_location: resolve.entityMerge('Idea', 'SUBJECT', 'Location', 'OUT'),
  post_about_person: resolve.entityMerge('Idea', 'SUBJECT', 'Person', 'OUT'),
  post_in_space: resolve.entityMerge('Idea', 'CONTAINS', 'Space', 'IN'),
});