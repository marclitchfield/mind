import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Concept', () => {
  applySetup();

  test('post to space', () => {
    return verifyMutations('Concept', 'post to space', {
      mutations: [
        ({space}) => gql`mutation { 
          Concept { concept:post(sourceId:"${space.id}" input:{title: "Test"}) { id } }
        }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") {
          concepts { title spaces { title } }
          rootConcepts { title spaces { title } }
        } 
      }`
    });
  });

  test('post to entity', () => {
    return verifyMutations('Concept', 'post to entity', {
      mutations: [
        ({space}) => gql`mutation { Event { event:createInSpace(spaceId:"${space.id}" input:{title:"test", datetime: "2011-12-12"}) { id } } }`,
        ({event}) => gql`mutation { Concept { concept:post(sourceId:"${event.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({concept}) => gql`query { 
        Concept(id:"${concept.id}") { 
          events { title concepts { title }}
        } 
      }`
    });
  });

  test('add entity', () => {
    return verifyMutations('Concept', 'add entity', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(spaceId:"${space.id}" input:{title:"test", datetime: "2011-12-12"}) { id } } }`,
        ({concept, event}) => gql`mutation { Concept { add(id:"${concept.id}" targetId:"${event.id}") } }`
      ],
      query: ({concept}) => gql`query { 
        Concept(id:"${concept.id}") { 
          events { title concepts { title }}
        }
      }`
    });
  });

  test('remove entity', () => {
    return verifyMutations('Concept', 'remove', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post(sourceId:"${space.id}"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(spaceId:"${space.id}" input:{title:"test", datetime: "2011-12-12"}) { id } } }`,
        ({concept, event}) => gql`mutation { Concept { add(id:"${concept.id}" targetId:"${event.id}") } }`,
        ({concept, event}) => gql`mutation { Concept { remove(id:"${concept.id}" targetId:"${event.id}") } }`
      ],
      query: ({concept}) => gql`query { 
        Concept(id:"${concept.id}") { 
          events { title concepts { title }}
        }
      }`
    });
  });

});