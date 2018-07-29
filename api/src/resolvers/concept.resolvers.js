import * as resolve from '../query';

const spec = {
  Collection: {name: 'INSTANCE_OF', direction: 'IN'},
  Concept: {name: 'SUB', direction: 'OUT'},
  Event: {name: 'DESCRIBED_BY', direction: 'IN'},
  Idea: {name: 'DESCRIBED_BY', direction: 'IN'},
  Items: {name: 'INSTANCE_OF', direction: 'IN'},
  Location: {name: 'DESCRIBED_BY', direction: 'IN'},
  Person: {name: 'DESCRIBED_BY', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Concept = () => ({
  post: resolve.entityMerge('Concept', spec),
  add: resolve.addRelationship('Concept', spec),
  remove: resolve.removeRelationship('Concept', spec),
})