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
  const response = await client.mutate({
    mutation: gql(TestCaseSetup.mutation)
  });

  updateState(response);
});

afterAll(async() => {
  await server.context.driver.close();
  await server.stop();
});

TestCases.forEach(testCase => {
  test(testCase.test, async() => {
    updateState(await client.mutate({ 
      mutation: gql(applyStateReplacements(testCase.mutation)),
    }));
    const response = await client.query({ 
      query: gql(applyStateReplacements(testCase.query)),
    });
    const snapshot = JSON.parse(JSON.stringify(response));
    expect(snapshot).toMatchSnapshot();
  });
});

function updateState(response) {
  Object.keys(response.data).forEach(outerKey => {
    Object.keys(response.data[outerKey]).forEach(innerKey => {
      state[innerKey] = response.data[outerKey][innerKey];
    });
  });
}

function applyStateReplacements(graphql) {
  let result = graphql;
  const re = /\$\((.*?)\.(.*?)\)/g;
  let m;
  while (m = re.exec(graphql)) {
    if (m.length == 3) {
      result = result.replace(m[0], state[m[1]][m[2]]);
    }
  }
  return result;
}

