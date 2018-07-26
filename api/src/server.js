import { resolvers } from "./resolvers";
import { ApolloServer } from "apollo-server";
import { v1 as neo4j } from "neo4j-driver";
import { makeExecutableSchema } from "graphql-tools";
import dotenv from "dotenv";
import * as fs from 'fs';

export function createServer() {
  const typeDefs = fs.readdirSync(__dirname + '/schema')
    .map(file => fs.readFileSync(__dirname + '/schema/' + file, 'utf8'))
    .join('\n');

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

  return new ApolloServer({
    schema,
    context: {
      driver
    }
  });
}