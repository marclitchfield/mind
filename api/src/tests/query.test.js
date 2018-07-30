import { applySetup, verifyMutations } from './test-setup';
import gql from 'graphql-tag';

describe('Query tests', () => {
  applySetup();

  test('simple post (idea in space)', () => {
    return verifyMutations('Query tests', 'simple post', {
      mutations: [
        ({space}) => gql`mutation { Idea { idea:post_to_space(input:{sourceId:"${space.id}", title: "test idea"}) { id } } }`
      ],
      query: ({idea}) => gql`query {
        Idea(input:{id:"${idea.id}"}) { title spaces { title } }
      }`
    });
  });

  test('post entity with beforeMerge (event in space)', () => {

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