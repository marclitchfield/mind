import * as resolve from '../query';

export const Reaction = () => ({
  post: async(args, context) => {
    const reaction = await resolve.entityMerge('Reaction', 'REACTION_OF', 'Idea', 'OUT', { cardinality: 1 })(
      input(args, undefined, 'subjectIdeaId'), context);

    await resolve.entityMerge('Reaction', 'REACTION_TO', 'Idea', 'IN', { cardinality: 1 })(
      input(args, reaction.id, 'responseIdeaId'), context);
    
    if (args.input.sourcePersonId !== undefined) {
      await resolve.entityMerge('Reaction', 'SOURCE_OF', 'Person', 'IN')(
        input(args, reaction.id, 'sourcePersonId'), context);
    }
    
    if (args.input.eventId !== undefined) {
      await resolve.entityMerge('Reaction', 'EVENT', 'Event', 'IN')(
        input(args, reaction.id, 'eventId'), context);
    }

    if (args.input.remove) {
      await resolve.runCypher('MATCH (r:Reaction {id: $id}) DETACH DELETE r')({ id: args.input.id }, context);
    }

    return reaction;
  }
});

function input(args, id, sourceIdProp) {
  return {
    input: {
      id: id || args.input.id,
      sourceId: args.input[sourceIdProp],
      type: args.input.type,
      remove: args.input.remove
    }
  };
}