import * as resolve from '../query';

const beforeMerge = (props) => { props.input.datetime = Date.parse(props.input.datetime)};

export const Event = () => ({
  post_timeline_of_collection: resolve.entityMerge('Event', 'TIMELINE', 'Collection', 'IN', { beforeMerge }),
  post_described_by_concept: resolve.entityMerge('Event', 'DESCRIBED_BY', 'Concept', 'OUT', { beforeMerge }),
  post_connected_to_event: resolve.entityMerge('Event', 'CONNECTED_TO', 'Event', 'OUT', { beforeMerge }),
  post_subject_of_idea: resolve.entityMerge('Event', 'SUBJECT', 'Idea', 'IN', { beforeMerge }),
  post_timeline_of_item: resolve.entityMerge('Event', 'TIMELINE', 'Item', 'IN', { beforeMerge }),
  post_timeline_of_location: resolve.entityMerge('Event', 'TIMELINE', 'Location', 'IN', { beforeMerge }),
  post_timeline_of_person: resolve.entityMerge('Event', 'TIMELINE', 'Person', 'IN', { beforeMerge }),
  post_in_space: resolve.entityMerge('Event', 'CONTAINS', 'Space', 'IN', { beforeMerge }),
});