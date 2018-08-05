import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Activity tests', () => {
  applySetup();

  test('create activity for ability', () => {
    return verifyMutations('Activity tests', 'create activity for ability', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({event, ability}) => gql`mutation { Activity { activity:post_for_ability(input:{sourceId:"${ability.id}", eventId:"${event.id}", title:"test ability activity"}) { id } } }`
      ],
      query: ({ability}) => gql`query {
        Ability(id:"${ability.id}") {
          title
          activities {
            title
            ability { title }
            event { title }
          }
        }
      }`
    });
  });

  test('create ability activity for person', () => {
    return verifyMutations('Activity tests', 'create ability activity for person', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title:"test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({ability, person, event}) => gql`mutation { Activity { post_for_ability(input:{sourceId:"${ability.id}", personId:"${person.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`
      ],
      query: ({ability}) => gql`query {
        Ability(id:"${ability.id}") {
          title
          activities {
            title
            ability { title }
            event { title }
            person { 
              title
              abilities {
                title
              }
              activities {
                title
              }
            }
          }
        }
      }`
    });
  });

  test('create objective activity for person', () => {
    return verifyMutations('Activity tests', 'create objective activity for person', {
      mutations: [
        ({space}) => gql`mutation { Objective { objective:post_in_space(input:{sourceId:"${space.id}", title:"test objective"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title:"test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({objective, person, event}) => gql`mutation { Activity { post_for_objective(input:{sourceId:"${objective.id}", personId:"${person.id}", eventId:"${event.id}" title:"test objective activity"}) { id } } }`
      ],
      query: ({objective}) => gql`query {
        Objective(id:"${objective.id}") {
          title
          activities {
            title
            objective { title }
            event { title }
            person { 
              title
              objectives {
                title
              }
              activities {
                title
              }
            }
          }
        }
      }`
    });
  });

  test('create ability activity for item', () => {
    return verifyMutations('Activity tests', 'create ability activity for item', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title:"test concept"}) { id } } }`,
        ({space, type}) => gql`mutation { Item { item:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test item"}) { id } } }`,
        ({ability, item, event}) => gql`mutation { Activity { post_for_ability(input:{sourceId:"${ability.id}", itemId:"${item.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`
      ],
      query: ({ability}) => gql`query {
        Ability(id:"${ability.id}") {
          title
          activities {
            title
            ability { title }
            event { title }
            item { 
              title
              abilities {
                title
              }
              activities {
                title
              }
            }
          }
        }
      }`
    });
  });

  test('remove ability activity', () => {
    return verifyMutations('Activity tests', 'remove ability activity', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title:"test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({ability, person, event}) => gql`mutation { Activity { activity:post_for_ability(input:{sourceId:"${ability.id}", personId:"${person.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`,
        ({ability, person, event, activity}) => gql`mutation { Activity { post_for_ability(input:{remove:true, id:"${activity.id}", sourceId:"${ability.id}", personId:"${person.id}", eventId:"${event.id}"}) { id } } }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          title
          abilities { 
            title 
            activities {
              title
              ability { title }
              event { title }
              person { title }
            }
          }
          activities { title }
        }
      }`
    });
  });

});
