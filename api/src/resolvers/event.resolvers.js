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
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForCollection: resolveEntityMerge(`
    MATCH (col:Collection {id: $collectionId})<-[:CONTAINS]-(s:Space) WITH col, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(col)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForItem: resolveEntityMerge(`
    MATCH (item:Item {id: $itemId})<-[:CONTAINS]-(s:Space) WITH item, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(item)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),  
  createForIdea: resolveEntityMerge(`
    MATCH (idea:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space) WITH idea, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:CONTAINS]-(idea)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForPerson: resolveEntityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space) WITH p, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(p)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) })
});