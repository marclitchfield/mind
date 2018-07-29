import * as resolve from '../query';

const spec = {
  Collection: {name: 'TIMELINE', direction: 'IN'},
  Concept: {name: 'DESCRIBED_BY', direction: 'OUT'},
  Event: {name: 'CONNECTED_TO', direction: 'OUT'},
  Idea: {name: 'CONTAINS', direction: 'IN'},
  Items: {name: 'TIMELINE', direction: 'IN'},
  Location: {name: 'TIMELINE', direction: 'IN'},
  Person: {name: 'TIMELINE', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Event = () => ({
  post: resolve.entityMergeFromSpec('Event', spec, {beforeMerge: (props) => { props.input.datetime = Date.parse(props.input.datetime)} }),
  add: resolve.addRelationshipFromSpec('Event', spec),
  remove: resolve.removeRelationshipFromSpec('Event', spec),
});