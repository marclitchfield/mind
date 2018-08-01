import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Person tests', () => {
  applySetup();

  test('create union', () => {
    return verifyMutations('Person tests', 'create union', {
      mutations: [
        ({space}) => gql`mutation { Person { person1:post_in_space(input:{sourceId:"${space.id}", title: "test person 1"}) { id } } }`,
        ({space}) => gql`mutation { Person { person2:post_in_space(input:{sourceId:"${space.id}", title: "test person 2"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person 2"}) { id } } }`,
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

  test('create offspring', () => {
    return verifyMutations('Person tests', 'create offspring', {
      mutations: [
        ({space}) => gql`mutation { Person { parent1:post_in_space(input:{sourceId:"${space.id}", title: "test parent 1"}) { id } } }`,
        ({space}) => gql`mutation { Person { parent2:post_in_space(input:{sourceId:"${space.id}", title: "test parent 2"}) { id } } }`,
        ({space}) => gql`mutation { Person { child:post_in_space(input:{sourceId:"${space.id}", title: "test child"}) { id } } }`,        
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person 2"}) { id } } }`,
        ({parent1, parent2, child, event}) => gql`mutation { Person { post_offspring(parent1:"${parent1.id}" parent2:"${parent2.id}" childId:"${child.id}" eventId:"${event.id}") } }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          people {
            title
            offspring {
              parents { title }
              child { title }
              event { title }
            }
            parents { title }
            children { title parents { title }}
          }
        }
      }`
    });
  });


});