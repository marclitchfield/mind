import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

let client, state;

export function applySetup() {
  beforeAll(async() => {
    client = new ApolloClient({
      link: new HttpLink({ uri: 'http://localhost:9999', fetch }),
      cache: new InMemoryCache()
    });
  });
  
  beforeEach(async() => {
    state = {};
  });
}

export async function verifyMutations(context, caseName, {mutations, query}) {
  await beforeEachMutation(context, caseName);
  await runMutations(mutations);
  const response = await runQuery(query);
  const snapshot = JSON.parse(JSON.stringify(response.data));
  expect(snapshot).toMatchSnapshot();
}

async function beforeEachMutation(context, caseName) {
  await runMutations([
    () => gql`mutation { Mind { mind:create(id:"test" input:{title: "Test Mind"}) { id } } }`,
    () => gql`mutation { Space { ctx:createInMind(id:"test.${context}" mindId:"test", input:{title: "${context}"}) { id } } }`,
    () => gql`mutation { Space { space:createSubSpace(superSpaceId:"test.${context}", input:{title: "${caseName}"}) { id } } }`
  ]);
}

async function runMutations(mutations) {
  for(const mutation of mutations) {
    const response = await client.mutate({ 
      mutation: mutation(state)
     }).catch(handleClientError);
    updateState(response);
  }
}

async function runQuery(query) {
  return await client.query({ 
    query: query(state)
  }).catch(handleClientError);
}

function updateState(response) {
  Object.keys(response.data).forEach(outerKey => {
    Object.keys(response.data[outerKey]).forEach(innerKey => {
      state[innerKey] = response.data[outerKey][innerKey];
    });
  });
}

function handleClientError(err) {
  if (err && err.networkError && err.networkError.result && err.networkError.result.errors) {
    const message = err.networkError.result.errors.map(formatError).join('\n');
    throw message;
  }
  throw err;
}

function formatError(graphqlError) {
  const locations = graphqlError.locations.map(loc => JSON.stringify(loc)).join('.');
  const message = `${graphqlError.extensions.code}: ${graphqlError.message} (${locations}`;
  return message.replace(/"/g, "'");
}

