import * as resolve from '../query';

export const Event = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForConcept: resolve.entityMerge(`
    MATCH (c:Concept {id: $conceptId})<-[:CONTAINS]-(s:Space) WITH c, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})-[:CONTAINS]->(c)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createAtLocation: resolve.entityMerge(`
    MATCH (loc:Location {id: $locationId})<-[:CONTAINS]-(s:Space) WITH loc, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})-[:AT]->(loc)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForCollection: resolve.entityMerge(`
    MATCH (col:Collection {id: $collectionId})<-[:CONTAINS]-(s:Space) WITH col, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(col)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForItem: resolve.entityMerge(`
    MATCH (item:Item {id: $itemId})<-[:CONTAINS]-(s:Space) WITH item, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(item)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),  
  createForIdea: resolve.entityMerge(`
    MATCH (idea:Idea {id: $ideaId})<-[:CONTAINS]-(s:Space) WITH idea, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:CONTAINS]-(idea)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),
  createForPerson: resolve.entityMerge(`
    MATCH (p:Person {id: $personId})<-[:CONTAINS]-(s:Space) WITH p, s
    MERGE (s)-[:CONTAINS]->(e:Event {id: $id})<-[:TIMELINE]-(p)
  `, 'e', (props) => { props.input.datetime = Date.parse(props.input.datetime) }),

  addLocation: resolve.addRelationship('Event', 'AT', 'Location', '$locationId'),
  addConcept: resolve.addRelationship('Event', 'CONTAINS', 'Concept', '$conceptId'),
  
  removeLocation: resolve.removeRelationship('Event', 'AT', 'Location', '$locationId'),
  removeConcept: resolve.removeRelationship('Event', 'CONTAINS', 'Concept', '$conceptId')
});