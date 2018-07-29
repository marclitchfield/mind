import * as resolve from '../query';

const spec = {
  Collection: {name: 'SUBJECT', direction: 'OUT'},
  Concept: {name: 'DESCRIBED_BY', direction: 'OUT'},
  Event: {name: 'SUBJECT', direction: 'OUT'},
  Idea: {name: 'RESPONSE_TO', direction: 'IN'},
  Items: {name: 'SUBJECT', direction: 'OUT'},
  Location: {name: 'SUBJECT', direction: 'OUT'},
  Person: {name: 'SUBJECT', direction: 'OUT'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Idea = () => ({
  post: resolve.entityMerge('Idea', spec),
  add: resolve.addRelationship('Idea', spec),
  remove: resolve.removeRelationship('Idea', spec),
});