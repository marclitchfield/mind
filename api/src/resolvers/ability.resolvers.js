import * as resolve from '../query';

export const Ability = () => ({
  post_described_by_concept: resolve.entityMerge('Ability', 'DESCRIBED_BY', 'Concept', 'OUT'),
  post_required_by_ability: resolve.entityMerge('Ability', 'REQUIRES', 'Ability', 'IN'),
  post_requires_ability: resolve.entityMerge('Ability', 'REQUIRES', 'Ability', 'OUT'),
  post_for_item: resolve.entityMerge('Ability', 'HAS', 'Item', 'IN'),
  post_for_person: resolve.entityMerge('Ability', 'HAS', 'Person', 'IN'),
  post_in_space: resolve.entityMerge('Ability', 'CONTAINS', 'Space', 'IN', { inheritSpace: false })
});

export const AbilityActivity = () => ({
  post_for_person: post_activity('Person'),
  post_for_item: post_activity('Item')
})

function post_activity(sourceEntityType) {
  return async(args, context) => {
    const activity = await resolve.entityMerge('AbilityActivity', 'EVENT', 'Event', 'OUT')(input(args, args.input.id, args.input.eventId), context);
    await resolve.entityMerge('AbilityActivity', 'ACTIVITY_FOR', 'Ability', 'OUT')(input(args, activity.id, args.input.abilityId), context);
    await resolve.entityMerge('AbilityActivity', 'PERFORMED', sourceEntityType, 'OUT')(input(args, activity.id, args.input.sourceId), context);
    await resolve.entityMerge(sourceEntityType, 'TIMELINE', 'Event', 'OUT')(input(args, args.input.sourceId, args.input.eventId), context);

    if (args.input.remove === true) {
      await resolve.runCypher('MATCH (aa:AbilityActivity {id: $id}) DETACH DELETE aa')({ id: args.input.id }, context);
    }
    return activity;
  };
}

function input(args, id, sourceId) {
  return {
    input: Object.assign({}, args.input, {
      id,
      sourceId,
    })
  };
}