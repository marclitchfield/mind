import { neo4jgraphql } from "neo4j-graphql-js";
import { Mind } from "./resolvers/mind.resolvers"
import { Space } from "./resolvers/space.resolvers"
import { Concept } from "./resolvers/concept.resolvers"
import { Position } from "./resolvers/position.resolvers"
import { Event } from "./resolvers/event.resolvers"

export const resolvers = {
  Query: {
    Minds: (_parent, args, context, resolvers) => neo4jgraphql('Mind', args, context, resolvers),
    Mind: neo4jgraphql,
    Space: neo4jgraphql,
    Concept: neo4jgraphql,
    Position: neo4jgraphql,
    Event: neo4jgraphql
  },
  Mutation: {
    Mind,
    Space,
    Concept,
    Position,
    Event
  }
};