import { resolvers } from "./resolvers";
import { ApolloServer } from "apollo-server";
import { v1 as neo4j } from "neo4j-driver";
import { makeExecutableSchema } from "graphql-tools";
import dotenv from "dotenv";
import * as fs from 'fs';

const typeDefs = fs.readFileSync(__dirname + '/schema.graphql', 'utf8');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "password"
  )
);

const server = new ApolloServer({
  schema,
  context: {
    driver
  }
});
 
server.listen(process.env.PORT || 5000, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});