import gql from "graphql-tag";

export const TestCaseSetup = {
  mutation: gql`mutation {
    mind: Mind { mind:create(id:"test" input:{title: "Test Mind"}) { id } }
    space: Space { space:createInMind(mindId:"test" input:{title: "test"}) { id } }
  }`,
}

export const TestCases = [
  {
    test: 'Concept.createInSpace',
    mutations: [
      gql`mutation { 
        Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } }
      }`
    ],
    query: gql`query { 
      Space(id:"$(space.id)") { 
        concepts { title spaces { title } }
        rootConcepts { title spaces { title } }
      } 
    }`
  },
  {
    test: 'Collection.createInstance',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { createInstance(classConceptId:"$(concept.id)" input:{title: "Test"}) { id } } }`
    ],
    query: gql`query { 
      Space(id:"$(space.id)") { 
        collections { title class { title } spaces { title } }
      } 
    }`
  },
];