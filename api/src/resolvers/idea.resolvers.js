import * as resolve from '../query';

const reactionMerge = `
  MATCH (subject:Idea {id:$subjectIdeaId}), (response:Idea {id:$responseIdeaId}) 
  MERGE (subject)<-[:REACTION_OF]-(reaction:Reaction {type:$type})<-[:REACTION_TO]-(response)
  `;

export const Idea = () => ({
  post_about_collection: resolve.entityMerge('Idea', 'SUBJECT', 'Collection', 'OUT'),
  post_described_by_concept: resolve.entityMerge('Idea', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_about_event: resolve.entityMerge('Idea', 'SUBJECT', 'Event', 'OUT'),
  post_super_idea: resolve.entityMerge('Idea', 'SUB', 'Idea', 'IN'),
  post_sub_idea: resolve.entityMerge('Idea', 'SUB', 'Idea', 'OUT'),
  post_about_item: resolve.entityMerge('Idea', 'SUBJECT', 'Item', 'OUT'),
  post_about_location: resolve.entityMerge('Idea', 'SUBJECT', 'Location', 'OUT'),
  post_about_person: resolve.entityMerge('Idea', 'SUBJECT', 'Person', 'OUT'),
  post_by_person: resolve.entityMerge('Idea', 'SOURCE_OF', 'Person', 'IN'),
  post_in_space: resolve.entityMerge('Idea', 'CONTAINS', 'Space', 'IN', { inheritSpace: false }),

  post_reaction: resolve.runCypher(reactionMerge),
  post_reaction_by_person: resolve.runCypher(reactionMerge + ' WITH reaction MATCH (person:Person {id: $personId}) MERGE (person)-[:SOURCE_OF]->(reaction)'),
  post_reaction_for_event: resolve.runCypher(reactionMerge + ' WITH reaction MATCH (event:Event {id: $eventId}) MERGE (event)-[:EVENT]->(reaction)')
});