import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Collection', () => {
  applySetup();

  test('createInSpace', () => {
    return verifyMutations('Collection', 'createInSpace', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space, concept}) => gql`mutation { Collection { createInSpace(spaceId:"${space.id}" classConceptId:"${concept.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          collections { title class { title } spaces { title } }
        } 
      }`
    });
  });

  test('createInstance', () => {
    return verifyMutations('Collection', 'createInstance', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { createInstance(classConceptId:"${concept.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          collections { title class { title } spaces { title } }
        } 
      }`
    });
  });

  test('createForPerson', () => {
    return verifyMutations('Collection', 'createForPerson', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({concept, person}) => gql`mutation { Collection { createForPerson(classConceptId:"${concept.id}" personId:"${person.id}" input:{title: "Test"}) { id } } }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          collections { title class { title } spaces { title } owners { title } }
        } 
      }`
    });
  });

  test('createAtLocation', () => {
    return verifyMutations('Collection', 'createAtLocation', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({concept, location}) => gql`mutation { Collection { collection:createAtLocation(classConceptId:"${concept.id}" locationId:"${location.id}" input:{title: "Test"}) { id } } }`,
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          collections { title class { title } spaces { title } owners { title } }
        } 
      }`
    });
  });
  
  test('addEvent', () => {
    return verifyMutations('Collection', 'addEvent', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:createInSpace(spaceId:"${space.id}" input:{title: "Test", datetime: "2012-01-01"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:createInstance(classConceptId:"${concept.id}" input:{title: "Test"}) { id } } }`,
        ({collection, event}) => gql`mutation { Collection { addEvent(id:"${collection.id}" eventId:"${event.id}") } }`
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { title timeline { title } }
      }`
    });
  });
  
  test('setClass', () => {
    return verifyMutations('Collection', 'setClass', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept1:createInSpace(spaceId:"${space.id}" input:{title: "Test1"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept2:createInSpace(spaceId:"${space.id}" input:{title: "Test2"}) { id } } }`,
        ({concept1}) => gql`mutation { Collection { collection:createInstance(classConceptId:"${concept1.id}" input:{title: "Test"}) { id } } }`,
        ({collection, concept2}) => gql`mutation { Collection { setClass(id:"${collection.id}" classConceptId:"${concept2.id}") } }`
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { title class { title } }
      }`
    });
  });
  
  test('setLocation', () => {
    return verifyMutations('Collection', 'setLocation', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Location { location1:createInSpace(spaceId:"${space.id}" input:{title: "Test1"}) { id } } }`,
        ({space}) => gql`mutation { Location { location2:createInSpace(spaceId:"${space.id}" input:{title: "Test2"}) { id } } }`,
        ({concept, location1}) => gql`mutation { Collection { collection:createAtLocation(classConceptId:"${concept.id}" locationId:"${location1.id}" input:{title: "Test"}) { id } } }`,
        ({collection, location2}) => gql`mutation { Collection { setLocation(id:"${collection.id}" locationId:"${location2.id}") } }`,
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { title class { title } location { title } }
      }`
    });
  });

  
  test('removeEvent', () => {
    return verifyMutations('Collection', 'removeEvent', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:createInSpace(spaceId:"${space.id}" input:{title: "Test", datetime: "2012-01-01"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:createInstance(classConceptId:"${concept.id}" input:{title: "Test"}) { id } } }`,
        ({collection, event}) => gql`mutation { Collection { addEvent(id:"${collection.id}" eventId:"${event.id}") } }`,
        ({collection, event}) => gql`mutation { Collection { removeEvent(id:"${collection.id}" eventId:"${event.id}") } }`
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { title class { title } timeline { title } }
      }`
    });
  });
  
  test('clearLocation', () => {
    return verifyMutations('Collection', 'clearLocation', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({location, concept}) => gql`mutation { Collection { collection:createAtLocation(locationId:"${location.id}" classConceptId:"${concept.id}" input:{title: "Test"}) { id } } }`,
        ({collection}) => gql`mutation { Collection { clearLocation(id:"${collection.id}") } }`,
      ],
      query: ({collection}) => gql`query { 
        Collection(id:"${collection.id}") { title location { title } }
      }`
    });
  });

});