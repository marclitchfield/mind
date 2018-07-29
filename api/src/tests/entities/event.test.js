import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe.only('Event', () => {
  applySetup();

  test('post to space', () => {
    return verifyMutations('Event', 'post to space', {
      mutations: [
        ({space}) => gql`mutation { 
          Event { event:post(sourceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } }
        }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") {
          events { title spaces { title } }
        } 
      }`
    });
  });

  test('post to entity', () => {
    return verifyMutations('Event', 'post to entity', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Event { event:post(sourceId:"${concept.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          concepts { title events { title } }
        } 
      }`
    });
  });

  test('add entity', () => {
    return verifyMutations('Event', 'add entity', {
      mutations: [
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(sourceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`,
        ({location, event}) => gql`mutation { Event { add(id:"${event.id}" targetId:"${location.id}") } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          locations { title timeline { title }}
        } 
      }`
    });
  });

  test('remove entity', () => {
    return verifyMutations('Event', 'remove', {
      mutations: [
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post(sourceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`,
        ({location, event}) => gql`mutation { Event { add(id:"${event.id}" targetId:"${location.id}") } }`,
        ({location, event}) => gql`mutation { Event { remove(id:"${event.id}" targetId:"${location.id}") } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          locations { title timeline { title }}
        } 
      }`
    });
  });

});