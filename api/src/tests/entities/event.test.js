import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe.only('Event', () => {
  applySetup();

  test('createInSpace', () => {
    return verifyMutations('Event', 'createInSpace', {
      mutations: [
        ({space}) => gql`mutation { 
          Event { event:createInSpace(spaceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } }
        }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          events { title spaces { title } }
        } 
      }`
    });
  });

  test('createForConcept', () => {
    return verifyMutations('Event', 'createForConcept', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Event { event:createForConcept(conceptId:"${concept.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          concepts { title events { title } }
        } 
      }`
    });
  });

  test('createAtLocation', () => {
    return verifyMutations('Event', 'createAtLocation', {
      mutations: [
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({location}) => gql`mutation { Event { event:createAtLocation(locationId:"${location.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          locations { title timeline { title }}
        } 
      }`
    });
  });

  test('createForCollection', () => {
    return verifyMutations('Event', 'createForCollection', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Collection { collection:createInstance(classConceptId:"${concept.id}" input:{title:"test"}) { id } } }`,
        ({collection}) => gql`mutation { Event { event:createForCollection(collectionId:"${collection.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          collections { title timeline { title } }
        } 
      }`
    });
  });

  test('createForItem', () => {
    return verifyMutations('Event', 'createForItem', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({concept}) => gql`mutation { Item { item:createInstance(classConceptId:"${concept.id}" input:{title:"test"}) { id } } }`,
        ({item}) => gql`mutation { Event { event:createForItem(itemId:"${item.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          items { title timeline { title } }
        } 
      }`
    });
  });

  test('createForIdea', () => {
    return verifyMutations('Event', 'createForIdea', {
      mutations: [
        ({space}) => gql`mutation { Idea { idea:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({idea}) => gql`mutation { Event { event:createForIdea(ideaId:"${idea.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          ideas { title events { title }}
        } 
      }`
    });
  });

  test('createForPerson', () => {
    return verifyMutations('Event', 'createForPerson', {
      mutations: [
        ({space}) => gql`mutation { Person { person:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({person}) => gql`mutation { Event { event:createForPerson(personId:"${person.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          people { title timeline { title }}
        } 
      }`
    });
  });

  test('addLocation', () => {
    return verifyMutations('Event', 'addLocation', {
      mutations: [
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:createInSpace(spaceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`,
        ({location, event}) => gql`mutation { Event { addLocation(id:"${event.id}" locationId:"${location.id}") } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          locations { title timeline { title }}
        } 
      }`
    });
  });

  test('removeLocation', () => {
    return verifyMutations('Event', 'removeLocation', {
      mutations: [
        ({space}) => gql`mutation { Location { location:createInSpace(spaceId:"${space.id}" input:{title:"test"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:createInSpace(spaceId:"${space.id}" input:{title: "Test", datetime: "2011-12-12"}) { id } } }`,
        ({location, event}) => gql`mutation { Event { addLocation(id:"${event.id}" locationId:"${location.id}") } }`,
        ({location, event}) => gql`mutation { Event { removeLocation(id:"${event.id}" locationId:"${location.id}") } }`
      ],
      query: ({event}) => gql`query { 
        Event(id:"${event.id}") { 
          locations { title timeline { title }}
        } 
      }`
    });
  });
});