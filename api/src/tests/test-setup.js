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
    () => gql`mutation { Mind { mind:post(input:{id: "test", title: "Test Mind"}) { id } } }`,
    () => gql`mutation { Space { ctx:post_in_mind(input:{id: "test.${context}", sourceId:"test", title: "${context}"}) { id } } }`,
    () => gql`mutation { Space { space:post_sub_space(input:{sourceId: "test.${context}", title: "${caseName}"}) { id } } }`
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
    throw err.networkError.result.errors.map(formatError).join('\n');
  }
  if (err && err.graphQLErrors) {
    throw err.graphQLErrors.map(formatError).join('\n');
  }
  throw err;
}

function formatError(graphqlError) {
  const locations = graphqlError.locations.map(loc => JSON.stringify(loc)).join('.');
  const path = path && graphqlError.path.join('.');
  const message = `${graphqlError.extensions.code}: ${graphqlError.message} (${locations}) @ ${path}`;
  return message.replace(/"/g, "'");
}

