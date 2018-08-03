import * as resolve from '../query';

export const Offspring = () => ({
  post: async(args, context) => {
    const offspring = await resolve.entityMerge('Offspring', 'CHILD', 'Person', 'OUT', { cardinality: 1 })(
      input(args, undefined, 'childId'), context);

    await resolve.entityMerge('Offspring', 'PARENT_OF', 'Person', 'IN')(
      input(args, offspring.id, 'parent1'), context);

    await resolve.entityMerge('Offspring', 'PARENT_OF', 'Person', 'IN')(
      input(args, offspring.id, 'parent2'), context);
    
    if (args.input.eventId !== undefined) {
      await resolve.entityMerge('Offspring', 'BIRTH', 'Event', 'OUT')(
        input(args, offspring.id, 'eventId'), context);
      await resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT')(
        input(args, args.input.parent1, 'eventId'), context);
      await resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT')(
        input(args, args.input.parent2, 'eventId'), context);
      await resolve.entityMerge('Person', 'TIMELINE', 'Event', 'OUT')(
        input(args, args.input.childId, 'eventId'), context);
    }

    return offspring;
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