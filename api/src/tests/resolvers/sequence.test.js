import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Sequence tests', () => {
  applySetup();

  test('create one element sequence', () => {
    return verifyMutations('Sequence tests', 'create one element sequence', {
      mutations: [
        ({space}) => gql`mutation { Person { person:post_in_space(input:{sourceId:"${space.id}", title: "element 1"}) { id } } }`,
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({space, type}) => gql`mutation { Sequence { sequence:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title: "test sequence"}) { id } } }`,
        ({person, sequence}) => gql`mutation { SequenceElement { post_next_person(input:{sequenceId:"${sequence.id}", sourceId:"${person.id}"}) { id } } }`,
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

  test('create sequence', () => {
    const SIZE = 5;
    return verifyMutations('Sequence tests', 'create sequence', {
      mutations: [
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({space, type}) => gql`mutation { Sequence { sequence:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test sequence"}) { id } } }`,
        ...[...Array(SIZE).keys()].map(i => 
          ({space}) => gql`mutation { Concept { concept_${i}:post_in_space(input:{sourceId:"${space.id}", title: "element ${i+1}"}) { id } } }`,
        ),
        ...[...Array(SIZE).keys()].map(i => {
          const source = `concept_${i}`;
          return (state) => gql`mutation { SequenceElement { post_next_concept(input:{sequenceId:"${state.sequence.id}", sourceId:"${state[source].id}"}) { id } } }`;
        })        
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

  test('remove element from head sequence', () => {
    return verifyMutations('Sequence tests', 'remove element from head', {
      mutations: [
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({space, type}) => gql`mutation { Sequence { sequence:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test sequence"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept1:post_in_space(input:{sourceId:"${space.id}", title: "element 1"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept2:post_in_space(input:{sourceId:"${space.id}", title: "element 2"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept3:post_in_space(input:{sourceId:"${space.id}", title: "element 3"}) { id } } }`,
        ({sequence, concept1}) => gql`mutation { SequenceElement { se1:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept1.id}"}) { id } } }`,
        ({sequence, concept2}) => gql`mutation { SequenceElement { se2:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept2.id}"}) { id } } }`,
        ({sequence, concept3}) => gql`mutation { SequenceElement { se3:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept3.id}"}) { id } } }`,
        ({sequence, concept1, se1}) => gql`mutation { SequenceElement { post_next_concept(input:{remove: true, id:"${se1.id}" sourceId:"${concept1.id}" sequenceId:"${sequence.id}"}) { id } } }`,
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

  test('remove element from tail of sequence', () => {
    return verifyMutations('Sequence tests', 'remove element from tail', {
      mutations: [
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({space, type}) => gql`mutation { Sequence { sequence:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test sequence"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept1:post_in_space(input:{sourceId:"${space.id}", title: "element 1"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept2:post_in_space(input:{sourceId:"${space.id}", title: "element 2"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept3:post_in_space(input:{sourceId:"${space.id}", title: "element 3"}) { id } } }`,
        ({sequence, concept1}) => gql`mutation { SequenceElement { se1:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept1.id}"}) { id } } }`,
        ({sequence, concept2}) => gql`mutation { SequenceElement { se2:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept2.id}"}) { id } } }`,
        ({sequence, concept3}) => gql`mutation { SequenceElement { se3:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept3.id}"}) { id } } }`,
        ({sequence, concept3, se3}) => gql`mutation { SequenceElement { post_next_concept(input:{remove: true, id:"${se3.id}" sourceId:"${concept3.id}" sequenceId:"${sequence.id}"}) { id } } }`,
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

  test('remove element from middle of sequence', () => {
    return verifyMutations('Sequence tests', 'remove element from middle', {
      mutations: [
        ({space}) => gql`mutation { Concept { type:post_in_space(input:{sourceId:"${space.id}", title: "sequence type"}) { id } } }`,
        ({space, type}) => gql`mutation { Sequence { sequence:post_in_space(input:{sourceId:"${space.id}", classId:"${type.id}", title:"test sequence"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept1:post_in_space(input:{sourceId:"${space.id}", title: "element 1"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept2:post_in_space(input:{sourceId:"${space.id}", title: "element 2"}) { id } } }`,
        ({space}) => gql`mutation { Concept { concept3:post_in_space(input:{sourceId:"${space.id}", title: "element 3"}) { id } } }`,
        ({sequence, concept1}) => gql`mutation { SequenceElement { se1:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept1.id}"}) { id } } }`,
        ({sequence, concept2}) => gql`mutation { SequenceElement { se2:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept2.id}"}) { id } } }`,
        ({sequence, concept3}) => gql`mutation { SequenceElement { se3:post_next_concept(input:{sequenceId:"${sequence.id}", sourceId:"${concept3.id}"}) { id } } }`,
        ({sequence, concept2, se2}) => gql`mutation { SequenceElement { post_next_concept(input:{remove: true, id:"${se2.id}" sourceId:"${concept2.id}" sequenceId:"${sequence.id}"}) { id } } }`,
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
