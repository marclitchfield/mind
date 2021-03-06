import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Entity tests', () => {
  applySetup();

  test('simple post (idea in space)', () => {
    return verifyMutations('Entity tests', 'idea in space', {
      mutations: [
        ({space}) => gql`mutation { Idea { idea:post_in_space(input:{sourceId:"${space.id}", title: "test idea"}) { id } } }`
      ],
      query: ({idea}) => gql`query {
        Idea(id:"${idea.id}") { title spaces { title } }
      }`
    });
  });

  test('post entity with beforeMerge (event in space)', () => {
    return verifyMutations('Entity tests', 'event in space', {
      mutations: [
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title: "test event", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query {
        Event(id:"${event.id}") { title datetime spaces { title } }
      }`
    });
  });

  test('post instance (item in space)', () => {
    return verifyMutations('Entity tests', 'item in space', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post_in_space(input:{sourceId:"${space.id}", title: "test concept"}) { id } } }`,
        ({space, concept}) => gql`mutation { Item { item:post_in_space(input:{sourceId:"${space.id}", classId:"${concept.id}", title: "test item"}) { id } } }`
      ],
      query: ({item}) => gql`query {
        Item(id:"${item.id}") { title class { title item_instances { title } } spaces { title } }
      }`
    });
  });

  test('post single cardinality (person at location)', () => {
    return verifyMutations('Entity tests', 'person at location', {
      mutations: [
        ({space}) => gql`mutation { Location { location:post_in_space(input:{sourceId:"${space.id}", title: "test location"}) { id } } }`,
        ({location}) => gql`mutation { Person { person:post_at_location(input:{sourceId:"${location.id}", title: "test person"}) { id } } }`
      ],
      query: ({person}) => gql`query {
        Person(id:"${person.id}") { title location { title people { title } } spaces { title } }
      }`
    });
  });

  test('post single cardinality update (update person location)', () => {
    return verifyMutations('Entity tests', 'update person location', {
      mutations: [
        ({space}) => gql`mutation { Location { location1:post_in_space(input:{sourceId:"${space.id}", title: "test location 1"}) { id } } }`,
        ({space}) => gql`mutation { Location { location2:post_in_space(input:{sourceId:"${space.id}", title: "test location 2"}) { id } } }`,
        ({location1}) => gql`mutation { Person { person:post_at_location(input:{sourceId:"${location1.id}", title: "test person"}) { id } } }`,
        ({person, location2}) => gql`mutation { Person { person:post_at_location(input:{id:"${person.id}", sourceId:"${location2.id}", title: "test person"}) { id } } }`
      ],
      query: ({person}) => gql`query {
        Person(id:"${person.id}") { title location { title people { title } } spaces { title } }
      }`
    });
  });

  test('post single cardinality instance (item at location)', () => {
    return verifyMutations('Entity tests', 'item at location', {
      mutations: [
        ({space}) => gql`mutation { Concept { concept:post_in_space(input:{sourceId:"${space.id}", title: "test concept"}) { id } } }`,
        ({space}) => gql`mutation { Location { location:post_in_space(input:{sourceId:"${space.id}", title: "test location"}) { id } } }`,
        ({concept, location}) => gql`mutation { Item { item:post_at_location(input:{sourceId:"${location.id}", classId:"${concept.id}", title: "test person"}) { id } } }`
      ],
      query: ({item}) => gql`query {
        Item(id:"${item.id}") {
          class { title item_instances { title } }
          location { title items { title } }
        }
      }`
    });
  });

  test('post properties (root concept in space)', () => {
    return verifyMutations('Entity tests', 'root concept in space', {
      mutations: [
        ({space}) => gql`mutation { Concept { rootConcept:post_in_space(input:{sourceId:"${space.id}", title: "root concept"}) { id } } }`,
        ({rootConcept}) => gql`mutation { Concept { leafConcept:post_sub_concept(input:{sourceId:"${rootConcept.id}", title: "sub concept"}) { id } } }`,
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          root_concepts { title spaces { title } }
          concepts { title spaces { title } }
        }
      }`
    });
  });

  test('post single cardinality removal (remove event at location)', () => {
    return verifyMutations('Entity tests', 'remove event at location', {
      mutations: [
        ({space}) => gql`mutation { Location { location:post_in_space(input:{sourceId:"${space.id}", title: "test location"}) { id } } }`,
        ({location}) => gql`mutation { Person { person:post_at_location(input:{sourceId:"${location.id}", title: "test person"}) { id } } }`,
        ({person, location}) => gql`mutation { Person { person:post_at_location(input:{remove: true, id:"${person.id}" sourceId:"${location.id}", title: "test person"}) { id } } }`,
      ],
      query: ({person}) => gql`query {
        Person(id:"${person.id}") { title location { title } }
      }`
    });
  });
});