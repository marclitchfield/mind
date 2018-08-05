import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Ability tests', () => {
  applySetup();

  test('create ability', () => {
    return verifyMutations('Ability tests', 'create ability', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          title
          abilities { title }
        }
      }`
    });
  });

  test('create ability activity for person', () => {
    return verifyMutations('Ability tests', 'create ability activity for person', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title:"test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({ability, person, event}) => gql`mutation { AbilityActivity { post_for_person(input:{sourceId:"${person.id}", abilityId:"${ability.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`
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
              person { 
                title
                abilities {
                  title
                }
                ability_activities {
                  title
                }
              }
            }
          }
        }
      }`
    });
  });

  test('create ability activity for item', () => {
    return verifyMutations('Ability tests', 'create ability activity for item', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title:"test concept"}) { id } } }`,
        ({space, type}) => gql`mutation { Item { item:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test item"}) { id } } }`,
        ({ability, item, event}) => gql`mutation { AbilityActivity { post_for_item(input:{sourceId:"${item.id}", abilityId:"${ability.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`
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
              item {
                title
                abilities {
                  title
                }
                ability_activities {
                  title
                }                
              }
            }
          }
        }
      }`
    });
  });

  test('remove ability activity', () => {
    return verifyMutations('Ability tests', 'remove ability activity', {
      mutations: [
        ({space}) => gql`mutation { Ability { ability:post_in_space(input:{sourceId:"${space.id}", title:"test ability"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title:"test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title:"test event", datetime:"2011-12-12"}) { id } } }`,
        ({ability, person, event}) => gql`mutation { AbilityActivity { activity:post_for_person(input:{sourceId:"${person.id}", abilityId:"${ability.id}", eventId:"${event.id}" title:"test ability activity"}) { id } } }`,
        ({ability, person, event, activity}) => gql`mutation { AbilityActivity { post_for_person(input:{remove:true, id:"${activity.id}", sourceId:"${person.id}", abilityId:"${ability.id}", eventId:"${event.id}"}) { id } } }`
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
        }
      }`
    });
  });

});
