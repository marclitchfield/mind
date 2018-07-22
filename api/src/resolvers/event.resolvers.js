import { resolveEntityMerge, resolveCypher } from '../query';

export const Event = () => ({
  createInSpace: resolveEntityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForConcept: resolveEntityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})-[:CONTAINS]->(c)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createAtLocation: resolveEntityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space) WITH loc, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})-[:AT]->(loc)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) })
});