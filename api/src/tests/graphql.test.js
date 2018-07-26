import { createServer } from '../server';
import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { TestCases, TestCaseSetup } from './test-cases';
import gql from "graphql-tag";

const server = createServer();
let client;
const state = {};

beforeAll(async() => {
  client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9999', fetch }),
    cache: new InMemoryCache()
  });
  
  await server.listen(9999);
  await client.mutate({
    mutation: gql`mutation { Mind { destroy(id:"test") } }`
  })
});

afterAll(async() => {
  await server.context.driver.close();
  await server.stop();
});

TestCases.forEach(testCase => {
  test(testCase.test, async() => {
    await testSetup(testCase.test);
    await runMutations(testCase.mutations);
    const response = await runQuery(testCase.query);
    const snapshot = JSON.parse(JSON.stringify(response.data));
    expect(snapshot).toMatchSnapshot();
  });
});

async function testSetup(testCase) {
  state['TEST_CASE'] = {name: testCase};
  const setupResponse = await client.mutate({
    mutation: applyStateReplacements(TestCaseSetup.mutation)
  });

  updateState(setupResponse);
}

async function runMutations(mutations) {
  for(const mutation of mutations) {
    const mutateResponse = await client.mutate({ 
      mutation: applyStateReplacements(mutation),
    }).catch(handleClientError);
    updateState(mutateResponse);
  }
}

async function runQuery(query) {
  return await client.query({ 
    query: applyStateReplacements(query),
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

function applyStateReplacements(graphql) {
  let result = graphql.loc.source.body;
  const re = /\$\((.*?)\.(.*?)\)/g;
  let m;
  while (m = re.exec(result)) {
    if (m.length == 3) {
      result = result.replace(m[0], state[m[1]][m[2]]);
    }
  }
  return gql(result);
}
