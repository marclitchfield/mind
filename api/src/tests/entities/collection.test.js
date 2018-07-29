import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';
import { spec } from '../../resolvers/collection.resolvers';

describe('Collection', () => {
  applySetup();

  test('post to space', () => {
    return verifyMutations('Collection', 'post to space', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({space, concept}) => gql`mutation { Collection { collection:post(sourceId:"${space.id}" classId:"${concept.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") {
          collections { 
            title 
            spaces { title } 
            class { title collections { title }} 
          }
        } 
      }`
    });
  });

  test('post to entity', () => {
    return verifyMutations('Collection', 'post to entity', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:post(sourceId:"${concept.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { 
          class { title collections { title }}
        }
      }`
    });
  });

  test('add entity', () => {
    return verifyMutations('Collection', 'add entity', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:post(sourceId:"${concept.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(spaceId:"${space.id}" input:{title:"test", datetime: "2011-12-12"}) { id } } }`,
        ({collection, event}) => gql`mutation { Collection { add(id:"${collection.id}" targetId:"${event.id}") } }`
      ],
      query: ({concept}) => gql`query { 
        Collection(id:"${concept.id}") { 
          class { title }
          events { title concepts { title }}
        }
      }`
    });
  });

  test('remove entity', () => {
    return verifyMutations('Collection', 'remove entity', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:post(sourceId:"${concept.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(spaceId:"${space.id}" input:{title:"test", datetime: "2011-12-12"}) { id } } }`,
        ({collection, event}) => gql`mutation { Collection { add(id:"${collection.id}" targetId:"${event.id}") } }`,
        ({collection, event}) => gql`mutation { Collection { remove(id:"${collection.id}" targetId:"${event.id}") } }`
      ],
      query: ({concept}) => gql`query { 
        Collection(id:"${concept.id}") { 
          class { title }
          events { title concepts { title }}
        }
      }`
    });
  });

});