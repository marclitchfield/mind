import { neo4jgraphql } from "neo4j-graphql-js";
const uuid = require('uuid/v4');

export const resolvers = {
  Mind: neo4jgraphql,
  Query: {
    allMinds: async(parent, args, context, resolvers) => neo4jgraphql('Mind', args, context, resolvers),
  
    Mind: neo4jgraphql,
    Space: neo4jgraphql,
    Concept: neo4jgraphql,
    Position: neo4jgraphql
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
        MERGE (s)-[:CONTAINS {root:true}]->(c:Concept {id: $id})
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
        MATCH (sc:Concept {id: $superConceptId})<-[:CONTAINS]-(s:Space) WITH s, sc
        MERGE (sc)-[:SUB]->(c:Concept {id: $id})<-[:CONTAINS]-(s)
        ON MATCH SET c.title = $title, c.body = $body, c.icon = $icon
        ON CREATE SET c.title = $title, c.body = $body, c.icon = $icon, c.created = timestamp()
        RETURN c AS concept, apoc.date.format(c.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('concept').properties, { created: record.get('created') });
    },
    addSubConcept: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      await session.run(`
        MERGE (sup:Concept {id: $superConceptId})-[:SUB]->(sub:Concept {id: $subConceptId})
      `, args);
    },
    createConceptPosition: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
        MERGE (c)<-[:CONTAINS]-(p:Position {id: $id})<-[:CONTAINS]-(s)
        ON MATCH SET p.title = $title, p.body = $body, p.icon = $icon
        ON CREATE SET p.title = $title, p.body = $body, p.icon = $icon, p.created = timestamp()
        RETURN p AS position, apoc.date.format(p.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('position').properties, { created: record.get('created') });
    },
    createResponsePosition: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (p:Position {id: $contextPositionId})<-[:CONTAINS]-(s:Space) WITH p, s
        MERGE (p)-[:RESPONSE]->(r:Position {id: $id})<-[:CONTAINS]-(s)
        ON MATCH SET r.title = $title, r.body = $body, r.icon = $icon
        ON CREATE SET r.title = $title, r.body = $body, r.icon = $icon, r.created = timestamp()
        RETURN r AS position, apoc.date.format(r.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('position').properties, { created: record.get('created') });
    },
    createSpaceEvent: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (s:Space {id: $spaceId}) WITH s
        MERGE (s)-[:CONTAINS]->(e:Event {id: $id})
        ON MATCH SET e.title = $title, e.icon = $icon, e.body = $body, e.type = $type, e.datetime = $datetime
        ON CREATE SET e.title = $title, e.icon = $icon, e.body = $body, e.type = $type, e.datetime = $datetime, e.created = timestamp()
        RETURN e AS event, apoc.date.format(e.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('event').properties, { created: record.get('created') });
    },
    createConceptEvent: async(parent, args, context, resolvers) => {
      const session = context.driver.session();
      const props = Object.assign({}, args, {
        id: args.id || uuid()
      });
      const result = await session.run(`
        MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
        MERGE (c)<-[:CONTAINS]-(e:Event {id: $id})<-[:CONTAINS]-(s)
        ON MATCH SET e.title = $title, e.icon = $icon, e.body = $body, e.type = $type, e.datetime = $datetime
        ON CREATE SET e.title = $title, e.icon = $icon, e.body = $body, e.type = $type, e.datetime = $datetime, e.created = timestamp()
        RETURN e AS event, apoc.date.format(e.created) AS created
      `, props);
      const record = result.records[0];
      return Object.assign({}, record.get('event').properties, { created: record.get('created') });
    }
  }
};