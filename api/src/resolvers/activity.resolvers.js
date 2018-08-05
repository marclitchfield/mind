import * as resolve from '../query';

export const Activity = () => ({
  post_for_ability: post_activity('Ability'),
  post_for_objective: post_activity('Objective')
})

function post_activity(sourceEntityType) {
  return async(args, context) => {
    const { sourceId, eventId, remove } = args.input;
   
    const activity = await resolve.entityMerge('Activity', 'EVENT', 'Event', 'OUT')(input(args, args.input.id, eventId), context);
    const activityId = activity.id;

    await resolve.entityMerge('Activity', 'ACTIVITY_FOR', sourceEntityType, 'OUT')(input(args, activity.id, sourceId), context);

    if (args.input.personId) {
      await post_activity_for({ sourceEntityType, sourceId, activityId, eventId, targetType: 'Person', targetId: args.input.personId, remove }, context);
    }
    if (args.input.itemId) {
      await post_activity_for({ sourceEntityType, sourceId, activityId, eventId, targetType: 'Item', targetId: args.input.itemId, remove }, context);
    }
    if (args.input.organizationId) {
      await post_activity_for({ sourceEntityType, sourceId, activityId, eventId, targetType: 'Organization', targetId: args.input.organizationId, remove }, context);
    }

    if (remove === true) {
      await resolve.runCypher('MATCH (a:Activity {id: $id}) DETACH DELETE a')({ id: args.input.id }, context);
    }

    return activity;
  };
}

async function post_activity_for({sourceEntityType, sourceId, activityId, eventId, targetType, targetId, remove}, context) {
  await resolve.entityMerge('Activity', 'PERFORMED', targetType, 'IN')({
    input: {
      id: activityId,
      sourceId: targetId,
      remove
    }
  }, context);
  await resolve.entityMerge(targetType, 'TIMELINE', 'Event', 'OUT')({
    input: {
      id: targetId,
      sourceId: eventId,
      remove
    }
  }, context);
  await resolve.entityMerge(targetType, 'HAS', sourceEntityType, 'OUT')({
    input: {
      id: targetId,
      sourceId,
      remove
    }
  }, context);
}

function input(args, id, sourceId) {
  return {
    input: Object.assign({}, args.input, {
      id,
      sourceId,
      eventId: undefined,
      personId: undefined,
      itemId: undefined
    })
  };
}