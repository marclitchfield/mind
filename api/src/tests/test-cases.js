import gql from "graphql-tag";

export const TestCaseSetup = {
  mutation: gql`mutation {
    mind: Mind { mind:create(id:"test" input:{title: "Test Mind"}) { id } }
    space: Space { space:createInMind(mindId:"test" input:{title: "$(TEST_CASE.name)"}) { id } }
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
    test: 'Collection.createInSpace',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { createInSpace(spaceId:"$(space.id)" classConceptId:"$(concept.id)" input:{title: "Test"}) { id } } }`
    ],
    query: gql`query { 
      Space(id:"$(space.id)") { 
        collections { title class { title } spaces { title } }
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
  {
    test: 'Collection.createForPerson',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Person { person:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { createForPerson(classConceptId:"$(concept.id)" personId:"$(person.id)" input:{title: "Test"}) { id } } }`
    ],
    query: gql`query { 
      Space(id:"$(space.id)") { 
        collections { title class { title } spaces { title } owners { title } }
      } 
    }`
  },
  {
    test: 'Collection.createAtLocation',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Location { location:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { collection:createAtLocation(classConceptId:"$(concept.id)" locationId:"$(location.id)" input:{title: "Test"}) { id } } }`,
    ],
    query: gql`query { 
      Space(id:"$(space.id)") { 
        collections { title class { title } spaces { title } owners { title } }
      } 
    }`
  },
  {
    test: 'Collection.addEvent',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Event { event:createInSpace(spaceId:"$(space.id)" input:{title: "Test", datetime: "2012-01-01"}) { id } } }`,
      gql`mutation { Collection { collection:createInstance(classConceptId:"$(concept.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { addEvent(id:"$(collection.id)" eventId:"$(event.id)") } }`
    ],
    query: gql`query { 
      Collection(id:"$(collection.id)") { title timeline { title } }
    }`
  },
  {
    test: 'Collection.setClass',
    mutations: [
      gql`mutation { Concept { concept1:createInSpace(spaceId:"$(space.id)" input:{title: "Test1"}) { id } } }`,
      gql`mutation { Concept { concept2:createInSpace(spaceId:"$(space.id)" input:{title: "Test2"}) { id } } }`,
      gql`mutation { Collection { collection:createInstance(classConceptId:"$(concept1.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { setClass(id:"$(collection.id)" classConceptId:"$(concept2.id)") } }`
    ],
    query: gql`query { 
      Collection(id:"$(collection.id)") { title class { title } }
    }`
  },
  {
    test: 'Collection.setLocation',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Location { location1:createInSpace(spaceId:"$(space.id)" input:{title: "Test1"}) { id } } }`,
      gql`mutation { Location { location2:createInSpace(spaceId:"$(space.id)" input:{title: "Test2"}) { id } } }`,
      gql`mutation { Collection { collection:createAtLocation(classConceptId:"$(concept.id)" locationId:"$(location1.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { setLocation(id:"$(collection.id)" locationId:"$(location2.id)") } }`,
    ],
    query: gql`query { 
      Collection(id:"$(collection.id)") { title class { title } location { title } }
    }`
  },
  {
    test: 'Collection.removeEvent',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Event { event:createInSpace(spaceId:"$(space.id)" input:{title: "Test", datetime: "2012-01-01"}) { id } } }`,
      gql`mutation { Collection { collection:createInstance(classConceptId:"$(concept.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { addEvent(id:"$(collection.id)" eventId:"$(event.id)") } }`,
      gql`mutation { Collection { removeEvent(id:"$(collection.id)" eventId:"$(event.id)") } }`
    ],
    query: gql`query { 
      Collection(id:"$(collection.id)") { title class { title } timeline { title } }
    }`
  },
  {
    test: 'Collection.clearLocation',
    mutations: [
      gql`mutation { Concept { concept:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Location { location:createInSpace(spaceId:"$(space.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { collection:createAtLocation(locationId:"$(location.id)" classConceptId:"$(concept.id)" input:{title: "Test"}) { id } } }`,
      gql`mutation { Collection { clearLocation(id:"$(collection.id)") } }`,
    ],
    query: gql`query { 
      Collection(id:"$(collection.id)") { title location { title } }
    }`
  },
];