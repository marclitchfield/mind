import { applySetup, verifyMutations } from '../test-setup';
import gql from 'graphql-tag';

describe('Concept', () => {
  applySetup();

  test('createInSpace', () => {
    return verifyMutations('Concept', 'createInSpace', {
      mutations: [
        ({space}) => gql`mutation { 
          Concept { concept:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } }
        }`
      ],
      query: ({space}) => gql`query { 
        Space(id:"${space.id}") { 
          concepts { title spaces { title } }
          rootConcepts { title spaces { title } }
        } 
      }`
    });
  });

  test('createSubConcept', () => {
    return verifyMutations('Concept', 'createSubConcept', {
      mutations: [
        ({space})  => gql`mutation { Concept { sup:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({sup}) => gql`mutation { Concept { sub:createSubConcept(superConceptId:"${sup.id}" input:{title: "Test"}) { id } } }`,
      ],
      query: ({sup}) => gql`query { 
        Concept(id:"${sup.id}") { 
          subConcepts { title superConcepts { title } }
        }
      }`
    });
  });

  test('addSubConcept', () => {
    return verifyMutations('Concept', 'addSubConcept', {
      mutations: [
        ({space}) => gql`mutation { Concept { sup:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Concept { sub:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({sup, sub}) => gql`mutation { Concept { addSubConcept(id:"${sup.id}" subConceptId:"${sub.id}") } }`,
      ],
      query: ({sup}) => gql`query { 
        Concept(id:"${sup.id}") { 
          subConcepts { title superConcepts { title } }
        }
      }`
    });
  }); 

  test('removeSubConcept', () => {
    return verifyMutations('Concept', 'addSubConcept', {
      mutations: [
        ({space}) => gql`mutation { Concept { sup:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({space}) => gql`mutation { Concept { sub:createInSpace(spaceId:"${space.id}" input:{title: "Test"}) { id } } }`,
        ({sup, sub}) => gql`mutation { Concept { addSubConcept(id:"${sup.id}" subConceptId:"${sub.id}") } }`,
        ({sup, sub}) => gql`mutation { Concept { removeSubConcept(id:"${sup.id}" subConceptId:"${sub.id}") } }`,
      ],
      query: ({sup}) => gql`query { 
        Concept(id:"${sup.id}") { 
          subConcepts { title superConcepts { title } }
        }
      }`
    });
  }); 
});