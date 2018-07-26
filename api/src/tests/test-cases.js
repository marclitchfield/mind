import { Mind } from "../resolvers/mind.resolvers";

export const TestCaseSetup = {
  mutation: `mutation {
    mind: Mind { mind:create(id:"test" input:{title: "Test Mind"}) { id } }
    space: Space { space:createInMind(mindId:"test" input:{title: "test"}) { id } }
  }`,
}

export const TestCases = [
  {
    test: 'Concept.createInSpace',
    mutation: `mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
    query: `query { Space(id:"$(space.id)") { 
      concepts { title spaces { title } }
      rootConcepts { title spaces { title } }
    } }`
  },
];