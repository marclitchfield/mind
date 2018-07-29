import * as resolve from '../query';

const spec = {
  Collection: {name: 'CONTAINS', direction: 'IN'},
  Concept: {name: 'INSTANCE_OF', direction: 'OUT'},
  Event: {name: 'TIMELINE', direction: 'OUT'},
  Idea: {name: 'LINKS_TO', direction: 'IN'},
  Items: {name: 'CONTAINS', direction: 'OUT'},
  Location: {name: 'AT', direction: 'OUT'},
  Person: {name: 'HAS', direction: 'IN'},
  Space: {name: 'CONTAINS', direction: 'IN'},
};

export const Item = () => ({
  post: resolve.entityMerge('Item', spec, {instance: true}),
  add: resolve.addRelationship('Item', spec),
  remove: resolve.removeRelationship('Item', spec),
  setClass: resolve.setRelationship('Item', 'INSTANCE_OF', '$classId'),
});