import * as resolve from '../query';

export const Item = () => ({
  post_in_collection: resolve.entityMerge('Item', 'CONTAINS', 'Collection', 'IN', { instance: true }),
  post_instance_of_concept: resolve.entityMerge('Item', 'INSTANCE_OF', 'Concept', 'OUT', { cardinality: 1 }),
  post_timeline_event: resolve.entityMerge('Item', 'TIMELINE', 'Event', 'OUT', { instance: true }),
  post_subject_of_idea: resolve.entityMerge('Item', 'SUBJECT', 'Idea', 'IN', { instance: true }),
  post_container_of_item: resolve.entityMerge('Item', 'CONTAINS', 'Item', 'OUT', { instance: true }),
  post_in_item: resolve.entityMerge('Item', 'CONTAINS', 'Item', 'IN', { instance: true }),
  post_at_location: resolve.entityMerge('Item', 'AT', 'Location', 'OUT', { instance: true, cardinality: 1 }),
  post_for_owner: resolve.entityMerge('Item', 'HAS', 'Person', 'IN', { instance: true }),
  post_in_space: resolve.entityMerge('Item', 'CONTAINS', 'Space', 'IN', { instance: true, inheritSpace: false }),
});