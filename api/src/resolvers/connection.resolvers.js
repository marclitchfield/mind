import * as resolve from '../query';

export const Connection = () => ({
  post: async(args, context) => {
    const connection = await resolve.entityMerge('Connection', 'PART_OF', 'Person', 'IN')(
      input(args, undefined, 'person1'), context);

    await resolve.entityMerge('Connection', 'PART_OF', 'Person', 'IN')(
      input(args, connection.id, 'person2'), context);
    
    if (args.input.eventId !== undefined) {
      await resolve.entityMerge('Connection', 'ESTABLISHED', 'Event', 'OUT', { cardinality: 1 })(
        input(args, connection.id, 'eventId'), context);
      await resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT')(
        input(args, args.input.person1, 'eventId'), context);
      await resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT')(
        input(args, args.input.person2, 'eventId'), context);
    }

    if (args.input.remove) {
      await resolve.runCypher('MATCH (c:Connection {id: $id}) DETACH DELETE c')({ id: args.input.id }, context);
    }

    return connection;
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