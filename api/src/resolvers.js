import { neo4jgraphql } from "neo4j-graphql-js";
import { Mind } from "./resolvers/mind.resolvers"
import { Space } from "./resolvers/space.resolvers"
import { Concept } from "./resolvers/concept.resolvers"
import { Idea } from "./resolvers/idea.resolvers"
import { Event } from "./resolvers/event.resolvers"
import { Person } from "./resolvers/person.resolvers"
import { Item } from "./resolvers/item.resolvers"
import { Location } from "./resolvers/location.resolvers"
import { Collection } from "./resolvers/collection.resolvers"

export const resolvers = {
  Query: {
    Minds: (_parent, args, context, resolvers) => neo4jgraphql('Mind', args, context, resolvers),
    Mind: neo4jgraphql,
    // Space: neo4jgraphql,
    // Concept: neo4jgraphql,
    // Idea: neo4jgraphql,
    // Event: neo4jgraphql,
    // Person: neo4jgraphql,
    // Item: neo4jgraphql,
    // Location: neo4jgraphql,
    // Collection: neo4jgraphql
  },
  Mutation: {
    Mind,
    // Space,
    // Concept,
    // Idea,
    // Event,
    // Person,
    // Item,
    // Location,
    // Collection
  }
};