import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Person tests', () => {
  applySetup();

  test('create union', () => {
    return verifyMutations('Person tests', 'create union', {
      mutations: [
        ({space}) => gql`mutation { Person { person1:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Person { person2:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person"}) { id } } }`,
        ({person1, person2, event}) => gql`mutation { Person { post_union(person1:"${person1.id}" person2:"${person2.id}" eventId:"${event.id}") } }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          people {
            title
            unions {
              participants { title }
              event { title }
            }
          }
        }
      }`
    });
  });
});