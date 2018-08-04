import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Sequence tests', () => {
  applySetup();

  test('create sequence', () => {
    return verifyMutations('Sequence tests', 'create sequence', {
      mutations: [
        ({space}) => gql`mutation { Person { person1:post_in_space(input:{sourceId:"${space.id}", title: "element 1"}) { id } } }`,
        ({space}) => gql`mutation { Person { person2:post_in_space(input:{sourceId:"${space.id}", title: "element 2"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept1:post_in_space(input:{sourceId:"${space.id}", title: "element 3"}) { id } } }`,        
        ({space}) => gql`mutation { Concept { concept2:post_in_space(input:{sourceId:"${space.id}", title: "element 4"}) { id } } }`,
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({type, person1}) => gql`mutation { Sequence { sequence:post_next_person(input:{sourceId:"${person1.id}", classId:"${type.id}", title:"test sequence"}) { id } } }`,
        ({sequence, person2}) => gql`mutation { Sequence { post_next_person(input:{id:"${sequence.id}", sourceId:"${person2.id}"}) { id } } }`,
        ({sequence, concept1}) => gql`mutation { Sequence { post_next_concept(input:{id:"${sequence.id}", sourceId:"${concept1.id}"}) { id } } }`,
        ({sequence, concept2}) => gql`mutation { Sequence { post_next_concept(input:{id:"${sequence.id}", sourceId:"${concept2.id}"}) { id } } }`,
      ],
      query: ({sequence}) => gql`query {
        Sequence(id:"${sequence.id}") {
          title
          class { title }
          head { type entity { title } next { type entity { title } } }
          tail { type entity { title } previous { type entity { title } } }
          elements { type entity { title } }
        }
      }`
    });
  });
});

// title
// class { title }
// spaces { title }
// head { type next { type } entity { id } }
// tail { type next { type } }

// classId
// tail { type sequence { title } entity { title } previous { entity { title } } }
// elements { type sequence { title } entity { title } next { entity { title } } previous { entity { title } } }