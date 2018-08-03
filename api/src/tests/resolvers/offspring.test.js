import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Offspring tests', () => {
  applySetup();

  test('create offspring', () => {
    return verifyMutations('Offspring tests', 'create offspring', {
      mutations: [
        ({space}) => gql`mutation { Person { parent1:post_in_space(input:{sourceId:"${space.id}", title: "test parent"}) { id } } }`,
        ({space}) => gql`mutation { Person { parent2:post_in_space(input:{sourceId:"${space.id}", title: "test parent"}) { id } } }`,
        ({space}) => gql`mutation { Person { child:post_in_space(input:{sourceId:"${space.id}", title: "test child"}) { id } } }`,        
        ({space}) => gql`mutation { Event { event:post_in_space(input:{
          sourceId:"${space.id}", datetime: "2010-07-17" title: "test person"}) { id } }
        }`,
        ({parent1, parent2, child, event}) => gql`mutation { Offspring { post(input:{
          parent1:"${parent1.id}" parent2:"${parent2.id}" childId:"${child.id}" eventId:"${event.id}"}) { id } }
        }`
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

  test('remove offspring', () => {
    return verifyMutations('Offspring tests', 'remove offspring', {
      mutations: [
        ({space}) => gql`mutation { Person { parent1:post_in_space(input:{sourceId:"${space.id}", title: "test parent"}) { id } } }`,
        ({space}) => gql`mutation { Person { parent2:post_in_space(input:{sourceId:"${space.id}", title: "test parent"}) { id } } }`,
        ({space}) => gql`mutation { Person { child:post_in_space(input:{sourceId:"${space.id}", title: "test child"}) { id } } }`,        
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person"}) { id } } }`,
        ({parent1, parent2, child, event}) => gql`mutation { Offspring { offspring:post(input:{
          parent1:"${parent1.id}" parent2:"${parent2.id}" childId:"${child.id}" eventId:"${event.id}"}) { id } } 
        }`,
        ({parent1, parent2, child, event, offspring}) => gql`mutation { Offspring { post(input:{
          remove: true, id:"${offspring.id}" parent1:"${parent1.id}" parent2:"${parent2.id}" childId:"${child.id}" eventId:"${event.id}"}) { id } } 
        }`
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