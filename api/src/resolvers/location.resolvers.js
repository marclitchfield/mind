import * as resolve from '../query';

const spec = {
  Collection: {name: 'AT', direction: 'IN'},
  Concept: {name: 'DESCRIBED_BY', direction: 'OUT'},
  Event: {name: 'TIMELINE', direction: 'OUT'},
  Idea: {name: 'SUBJECT', direction: 'IN'},
  Items: {name: 'AT', direction: 'IN'},
  Location: {name: 'CONTAINS', direction: 'OUT'},
  Person: {name: 'AT', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Location = () => ({
  post: resolve.entityMerge('Location', spec),
  add: resolve.addRelationship('Location', spec),
  remove: resolve.removeRelationship('Location', spec),
});