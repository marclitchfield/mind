import * as resolve from '../query';

const spec = {
  Collection: {name: 'CONTAINS', direction: 'OUT'},
  Concept: {name: 'INSTANCE_OF', direction: 'OUT'},
  Event: {name: 'TIMELINE', direction: 'OUT'},
  Idea: {name: 'SUBJECT', direction: 'IN'},
  Items: {name: 'CONTAINS', direction: 'OUT'},
  Location: {name: 'AT', direction: 'OUT'},
  Person: {name: 'HAS', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Collection = () => ({
  post: resolve.entityMerge('Collection', spec, {instance: true}),
  add: resolve.addRelationship('Collection', spec),
  remove: resolve.removeRelationship('Collection', spec),
  setClass: resolve.setRelationship('Collection', 'INSTANCE_OF', '$classId'),
});