import * as resolve from '../query';

export const Sequence = () => ({
  post_in_space: resolve.entityMerge('Sequence', 'CONTAINS', 'Space', 'IN', { inheritSpace: false, instance: true })
});

export const SequenceElement = () => ({
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
    const sequenceId = args.input.sequenceId;
    const element = await resolve.entityMerge('SequenceElement', 'ENTITY', targetEntityType, 'OUT')(
      { input: { id: args.input.id, remove: args.input.remove, sourceId: args.input.sourceId, type: targetEntityType } }, context);
    
    await resolve.entityMerge('SequenceElement', 'ELEMENT_OF', 'Sequence', 'OUT')(
      { input: { id: element.id, remove: args.input.remove, sourceId: sequenceId } }, context);

    if (args.input.remove === true) {
      await removeElement(sequenceId, element.id, context);
    } else {
      await appendElement(sequenceId, element.id, context);
    }

    return element;
  };
}

async function removeElement(sequenceId, elementId, context) {
  const head = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequenceId}"})-[:HEAD]->(se:SequenceElement) RETURN se AS entity`)({ sequenceId }, context);
  const tail = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequenceId}"})-[:TAIL]->(se:SequenceElement) RETURN se AS entity`)({ sequenceId }, context);
  const next = await resolve.runCypher(`MATCH (:SequenceElement {id:$elementId})-[:NEXT]->(se:SequenceElement) RETURN se AS entity`)({ elementId }, context);
  const prev = await resolve.runCypher(`MATCH (:SequenceElement {id:$elementId})<-[:NEXT]-(se:SequenceElement) RETURN se AS entity`)({ elementId }, context);

  // if this == head, set head = this->next
  if (head !== undefined && head.id === elementId) {
    if (next !== undefined) {
      await resolve.entityMerge('Sequence', 'HEAD', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequenceId, sourceId: next.id } }, context);
    }
  }

  // if this == tail, set tail = this->previous
  if (tail !== undefined && tail.id === elementId) {
    if (prev !== undefined) {
      await resolve.entityMerge('Sequence', 'TAIL', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequenceId, sourceId: prev.id } }, context);
    }
  }

  // if previous, set previous->next = this->next
  if (prev !== undefined) {
    if (next !== undefined) {
      await resolve.entityMerge('SequenceElement', 'NEXT', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: prev.id, sourceId: next.id } }, context);
    } else {
      await resolve.entityMerge('SequenceElement', 'NEXT', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { remove: true, id: prev.id, sourceId: elementId } }, context);
    }
  }

  await resolve.runCypher('MATCH (se:SequenceElement {id: $id}) DETACH DELETE se')({ id: elementId }, context);
}

async function appendElement(sequenceId, elementId, context) {
  const head = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequenceId}"})-[:HEAD]->(se:SequenceElement) RETURN se AS entity`)({ sequenceId }, context);
  const tail = await resolve.runCypher(`MATCH (seq:Sequence {id:"${sequenceId}"})-[:TAIL]->(se:SequenceElement) RETURN se AS entity`)({ sequenceId }, context);
  
  if (head === undefined) {
    // set head and tail
    await resolve.entityMerge('Sequence', 'HEAD', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequenceId, sourceId: elementId } }, context);
    await resolve.entityMerge('Sequence', 'TAIL', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequenceId, sourceId: elementId } }, context);
  } else {
    // set next and tail
    await resolve.entityMerge('SequenceElement', 'NEXT', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: tail.id, sourceId: elementId } }, context);
    await resolve.entityMerge('Sequence', 'TAIL', 'SequenceElement', 'OUT', { cardinality: 1 })({ input: { id: sequenceId, sourceId: elementId } }, context);
  }
}