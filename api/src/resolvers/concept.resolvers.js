import * as resolve from '../query';

export const Concept = () => ({
  createInSpace: resolve.entityMerge(`
    MATCH (s:Space {id: $spaceId}) WITH s
    MERGE (s)-[:CONTAINS {root:true}]->(c:Concept {id: $id})
  `, 'c'),
  createSubConcept: resolve.entityMerge(`
    MATCH (sc:Concept {id: $superConceptId})<-[:CONTAINS]-(s:Space) WITH s, sc
    MERGE (sc)-[:SUB]->(c:Concept {id: $id})<-[:CONTAINS]-(s)  
  `, 'c'),

  addSubConcept: resolve.addRelationship('Concept', 'SUB', 'Concept', '$subConceptId'),
  removeSubConcept: resolve.removeRelationship('Concept', 'SUB', 'Concept', '$subConceptId'),
})