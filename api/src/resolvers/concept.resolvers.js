import * as resolve from '../query';

export const Concept = () => ({
  post_class_of_collection: resolve.entityMerge('Concept', 'INSTANCE_OF', 'Collection', 'IN'),
  post_super_concept: resolve.entityMerge('Concept', 'SUB', 'Concept', 'OUT'),
  post_sub_concept: resolve.entityMerge('Concept', 'SUB', 'Concept', 'IN'),
  post_description_of_event: resolve.entityMerge('Concept', 'DESCRIBED_BY', 'Event', 'IN'),
  post_description_of_idea: resolve.entityMerge('Concept', 'DESCRIBED_BY', 'Idea', 'IN'),
  post_class_of_item: resolve.entityMerge('Concept', 'INSTANCE_OF', 'Item', 'IN'),
  post_description_of_location: resolve.entityMerge('Concept', 'DESCRIBED_BY', 'Location', 'IN'),
  post_description_of_person: resolve.entityMerge('Concept', 'DESCRIBED_BY', 'Person', 'IN'),
  post_in_space: resolve.entityMerge('Concept', 'CONTAINS', 'Space', 'IN', { relationshipProperties: { root: true }, inheritSpace: false}),
})