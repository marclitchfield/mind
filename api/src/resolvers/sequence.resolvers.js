import * as resolve from '../query';

export const Sequence = () => ({
  post_in_space: resolve.entityMerge('Sequence', 'CONTAINS', 'Space', 'IN', { inheritSpace: false }),
  post_next_collection: post_next('Collection'),
  post_next_concept: post_next('Concept'),
  post_next_event: post_next('Event'),
  post_next_idea: post_next('Idea'),
  post_next_item: post_next('Item'),
  post_next_location: post_next('Location'),
  post_next_person: post_next('Person'),
})

function post_next(targetEntityType) {
  return async(args, context) => {
    const element = await resolve.entityMerge('SequenceElement', 'ENTITY', targetEntityType, 'OUT')(
      { input: { sourceId: args.input.sourceId, type: targetEntityType } }, context);
      
    const sequence = await resolve.entityMerge('Sequence', 'ELEMENT_OF', 'SequenceElement', 'IN', { instance: args.input.classId !== undefined })(
      { input: Object.assign({}, args.input, { sourceId: element.id }) }, context);

    const head = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequence.id}"})-[:HEAD]->(se:SequenceElement) RETURN se AS entity`)(args, context);
    const tail = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequence.id}"})-[:TAIL]->(se:SequenceElement) RETURN se AS entity`)(args, context);

    if (head === undefined) {
      await resolve.entityMerge('Sequence', 'HEAD', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequence.id, sourceId: element.id } }, context);
      await resolve.entityMerge('Sequence', 'TAIL', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequence.id, sourceId: element.id } }, context);
    } else {
      await resolve.entityMerge('SequenceElement', 'NEXT', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: tail.id, sourceId: element.id } }, context);
      await resolve.entityMerge('Sequence', 'TAIL', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequence.id, sourceId: element.id } }, context);
    }

    return sequence;
  };
}
