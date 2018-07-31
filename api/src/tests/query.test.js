import { applySetup, verifyMutations } from './test-setup';
import gql from 'graphql-tag';

describe('Query tests', () => {
  applySetup();

  test('simple post (idea in space)', () => {
    return verifyMutations('Query tests', 'idea in space', {
      mutations: [
        ({space}) => gql`mutation { Idea { idea:post_in_space(input:{sourceId:"${space.id}", title: "test idea"}) { id } } }`
      ],
      query: ({idea}) => gql`query {
        Idea(id:"${idea.id}") { title spaces { title } }
      }`
    });
  });

  test('post entity with beforeMerge (event in space)', () => {
    return verifyMutations('Query tests', 'event in space', {
      mutations: [
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title: "test event", datetime: "2011-12-12"}) { id } } }`
      ],
      query: ({event}) => gql`query {
        Event(id:"${event.id}") { title datetime spaces { title } }
      }`
    });
  });

  test('post instance (item in space)', () => {

  });

  test('post single cardinality (person at location)', () => {

  });

  test('post single cardinality instance (item at location)', () => {

  });

  test('post properties (root concept in space)', () => {

  });

  test('post removal (idea in space)', () => {

  });
});