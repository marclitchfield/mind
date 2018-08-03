import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Reaction tests', () => {
  applySetup();

  test('create reaction', () => {
    return verifyMutations('Reaction tests', 'post reaction', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({subject, response}) => gql`mutation { Reaction { reaction:post(input:{subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}", type:"answer"}) { id } } }`,
      ],
      query: ({reaction}) => gql`query {
        Reaction(id:"${reaction.id}") {
          type
          subject {
            title
            reactionsTo { type subject { title } response { title } }
            reactionsOf { type subject { title } response { title } }
          }
          response {
            title
            reactionsTo { type subject { title } response { title } }
            reactionsOf { type subject { title } response { title } }
          }
        }
      }`
    });
  });

  test('create reaction by person', () => {
    return verifyMutations('Reaction tests', 'create reaction by person', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({subject, response, person}) => gql`mutation { Reaction { 
          reaction:post(input:{sourcePersonId: "${person.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer"}) { id } } 
        }`,
      ],
      query: ({reaction}) => gql`query {
        Reaction(id:"${reaction.id}") {
          type
          subject { title }
          response { title }
          sourcePerson { title }
        }
      }`
    });
  });

  test('create reaction for event', () => {
    return verifyMutations('Reaction tests', 'create reaction for event', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title: "test event", datetime: "2011-12-12"}) { id } } }`,
        ({subject, response, event}) => gql`mutation { Reaction { 
          reaction:post(input:{eventId: "${event.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer"}) { id } } 
        }`,
      ],
      query: ({reaction}) => gql`query {
        Reaction(id:"${reaction.id}") {
          type
          subject { title }
          response { title }
          event { title }
        }
      }`
    });
  });

  test('remove reaction', () => {
    return verifyMutations('Reaction tests', 'remove reaction', {
      mutations: [
        ({space}) => gql`mutation { Idea { subject:post_in_space(input:{sourceId:"${space.id}", title: "subject idea"}) { id } } }`,
        ({space}) => gql`mutation { Idea { response:post_in_space(input:{sourceId:"${space.id}", title: "response idea"}) { id } } }`,
        ({space}) => gql`mutation { Event { event:post_in_space(input:{sourceId:"${space.id}", title: "test event", datetime: "2011-12-12"}) { id } } }`,
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title: "test person"}) { id } } }`,
        ({subject, response, person, event}) => gql`mutation { Reaction { reaction:post(input:{
          sourcePersonId: "${person.id}", eventId: "${event.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}" type:"answer"}) { id } } 
        }`,
        ({reaction, subject, response, person, event}) => gql`mutation { Reaction { post(input:{
          id: "${reaction.id}", remove: true, sourcePersonId: "${person.id}", eventId: "${event.id}", subjectIdeaId:"${subject.id}", responseIdeaId:"${response.id}"}) { id } } 
        }`,
      ],
      query: ({subject, response}) => gql`query {
        i1:Idea(id:"${subject.id}") {
          reactionsOf { type }
          reactionsTo { type }
        }
        i2:Idea(id:"${response.id}") {
          reactionsOf { type }
          reactionsTo { type }
        }
      }`
    });
  });
});