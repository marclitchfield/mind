import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Idea tests', () => {
  applySetup();

  test('create reaction', () => {
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

  test('create reaction by person', () => {
    return verifyMutations('Idea tests', 'create reaction by person', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({subject, response, person}) => gql`mutation { Idea { post_reaction_by_person(personId: "${person.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer") } }`,
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          ideas {
            title
            reactionsTo { type subject { title } response { title } sourcePerson { title } }
            reactionsOf { type subject { title } response { title } sourcePerson { title } }
          }
        }
      }`
    });
  });

  test('create reaction for event', () => {
    return verifyMutations('Idea tests', 'create reaction for event', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title: "test event", datetime: "2011-12-12"}) { id } } }`,
        ({subject, response, event}) => gql`mutation { Idea { post_reaction_for_event(eventId: "${event.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer") } }`,
      ],
      query: ({space}) => gql`query {
        Space(id:"${space.id}") {
          ideas {
            title
            reactionsTo { type subject { title } response { title } event { title } }
            reactionsOf { type subject { title } response { title } event { title } }
          }
        }
      }`
    });
  });
});