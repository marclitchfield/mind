import * as resolve from '../query';

export const Collection = () => ({
  post_container_of_collection: resolve.entityMerge('Collection', 'CONTAINS', 'Collection', 'OUT', { instance: true }),
  post_instance_of_concept: resolve.entityMerge('Collection', 'INSTANCE_OF', 'Concept', 'OUT', { cardinality: 1 }),
  post_timeline_of_event: resolve.entityMerge('Collection', 'TIMELINE', 'Event', 'OUT', { instance: true }),
  post_subject_of_idea: resolve.entityMerge('Collection', 'SUBJECT', 'Idea', 'IN', { instance: true }),
  post_container_of_item: resolve.entityMerge('Collection', 'CONTAINS', 'Item', 'OUT', { instance: true }),
  post_at_location: resolve.entityMerge('Collection', 'AT', 'Location', 'OUT', { instance: true, cardinality: 1 }),
  post_for_person: resolve.entityMerge('Collection', 'HAS', 'Person', 'IN', { instance: true }),
  post_in_space: resolve.entityMerge('Collection', 'CONTAINS', 'Space', 'IN', { instance: true, inheritSpace: false }),
});