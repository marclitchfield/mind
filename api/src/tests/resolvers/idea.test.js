import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Idea tests', () => {
  applySetup();

  test('create union', () => {
    return verifyMutations('Idea tests', 'create reaction', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({subject, response}) => gql`mutation { Idea { post_reaction(subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer") } }`,
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          ideas {
            title
            reactionsTo { type subject { title } response { title } }
            reactionsOf { type subject { title } response { title } }
          }
        }
      }`
    });
  });


});