import { neo4jgraphql } from "neo4j-graphql-js";
const uuid = require('uuid/v4');

export const resolvers = {
  Mind: neo4jgraphql,
  Query: {
    allMinds: async(parent, args, context, resolvers) => neo4jgraphql('Mind', args, context, resolvers),
    Mind: neo4jgraphql,
    Space: neo4jgraphql,
    Concept: neo4jgraphql
  },
  Mutation: {
    createMind: async(parent, args, context) => {
      const session = context.driver.session();
      const props = { id: args.id || uuid() };
      const result = await session.run(`
        MERGE (m:Mind {id: $id})
        ON CREATE SET m.created = timestamp()
        RETURN m.id AS id, apoc.date.format(m.created) AS created
      `, props);
      const record = result.records[0];
      return { id: record.get('id'), created: record.get('created') };
    },
    createSpace: async(parent, args, context) => {
      const session = context.driver.session();
      const props = { 
        id: args.id || uuid(),
        name: args.name,
        mindId: args.mindId
      };
      const result = await session.run(`
        MATCH (m:Mind {id: $mindId}) WITH m
        MERGE (m)-[:CONTAINS]->(s:Space {id: $id, name: $name})
        ON CREATE SET s.created = timestamp()
        RETURN s.id AS id, s.name as name, apoc.date.format(s.created) AS created
      `, props);
      const record = result.records[0];
      return { id: record.get('id'), created: record.get('created'), name: record.get('name') };
    },
    createSpaceConcept: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (s:Space {id: $spaceId}) WITH s
        MERGE (s)-[:CONTAINS]->(c:Concept {id: $id})
        ON MATCH SET c.title = $title, c.body = $body, c.icon = $icon
        ON CREATE SET c.title = $title, c.body = $body, c.icon = $icon, c.created = timestamp()
        RETURN c AS concept, apoc.date.format(c.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('concept').properties, { created: record.get('created') });
    },
    createSubConcept: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (sc:Concept {id: $superConceptId}) WITH sc
        MERGE (sc)-[:SUB]->(c:Concept {id: $id})
        ON MATCH SET c.title = $title, c.body = $body, c.icon = $icon
        ON CREATE SET c.title = $title, c.body = $body, c.icon = $icon, c.created = timestamp()
        RETURN c AS concept, apoc.date.format(c.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('concept').properties, { created: record.get('created') });
    }
  }
};