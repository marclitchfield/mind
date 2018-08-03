import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Connection tests', () => {
  applySetup();

  test('create connection', () => {
    return verifyMutations('Connection tests', 'create connection', {
      mutations: [
        ({space}) => gql`mutation { Person { person1:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Person { person2:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person"}) { id } } }`,
        ({person1, person2, event}) => gql`mutation { Connection { connection:post(input:{person1:"${person1.id}" person2:"${person2.id}" eventId:"${event.id}" type:"union"}) { id } } }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          people {
            title
            connections {
              participants { title }
              event { title }
            }
          }
        }
      }`
    });
  });

  test('remove connection', () => {
    return verifyMutations('Connection tests', 'remove connection', {
      mutations: [
        ({space}) => gql`mutation { Person { person1:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Person { person2:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", datetime: "2010-07-17" title: "test person"}) { id } } }`,
        ({person1, person2, event}) => gql`mutation { Connection { connection:post(input:{
          person1:"${person1.id}" person2:"${person2.id}" eventId:"${event.id}" type:"union"}) { id } } 
        }`,
        ({connection, person1, person2, event}) => gql`mutation { Connection { post(input:{
          remove: true, id:"${connection.id}" person1:"${person1.id}" person2:"${person2.id}" eventId:"${event.id}" type:"union"}) { id } } 
        }`
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          people {
            title
            connections {
              participants { title }
              event { title }
            }
          }
        }
      }`
    });
  });
});