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
import { Reaction } from "./resolvers/reaction.resolvers"
import { Offspring } from "./resolvers/offspring.resolvers"
import { Connection } from "./resolvers/connection.resolvers"
import { Sequence, SequenceElement } from "./resolvers/sequence.resolvers"

const neo4jgraphResolver = (type, args, context, resolvers) => neo4jgraphql(type, args, context, resolvers, false);

export const resolvers = {
  Query: {
    Mind: neo4jgraphResolver,
    Minds: (_parent, args, context, resolvers) => neo4jgraphResolver('Mind', args, context, resolvers, false),
    Entity: neo4jgraphResolver,
    Space: neo4jgraphResolver,
    Concept: neo4jgraphResolver,
    Idea: neo4jgraphResolver,
    Event: neo4jgraphResolver,
    Person: neo4jgraphResolver,
    Item: neo4jgraphResolver,
    Location: neo4jgraphResolver,
    Collection: neo4jgraphResolver,
    Reaction: neo4jgraphResolver,
    Offspring: neo4jgraphResolver,
    Connection: neo4jgraphResolver,
    Sequence: neo4jgraphResolver,
    SequenceElement: neo4jgraphResolver,
  },
  Mutation: {
    Mind,
    Space,
    Concept,
    Idea,
    Event,
    Person,
    Item,
    Location,
    Collection,
    Reaction,
    Offspring,
    Connection,
    Sequence,
  }
};
