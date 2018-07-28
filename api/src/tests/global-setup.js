import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createServer } from "../server";
import gql from "graphql-tag";

module.exports = async function globalSetup() {
  global.server = createServer();
  await global.server.listen(9999);

  const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9999', fetch }),
    cache: new InMemoryCache()
  });
  await client.mutate({
    mutation: gql`mutation { Mind { destroy(id:"test") } }`
  });
}

