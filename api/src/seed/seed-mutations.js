export default `mutation {
  Mind {
    m:create(id:"1", input:{title:"self"}) { id }
  }
  Space {
    s:createInMind(id:"1" mindId:"1" input:{title:"Ideas"}) { id }
  }
  Concept{
    c1:createInSpace(id:"c1" spaceId:"1" input:{title:"c1" body:"the body" icon:"concept.png"}) { id }
    c2:createInSpace(id:"c2" spaceId:"1" input:{title:"c2" body:"the body" icon:"concept.png"}) { id }
    c3:createSub(id:"c3" superConceptId:"c1" input:{title:"c3" body:"the body" icon:"concept.png"}) { id }
    c4:createSub(id:"c4" superConceptId:"c1" input:{title:"c4" body:"the body" icon:"concept.png"}) { id }
    c5:createSub(id:"c5" superConceptId:"c3" input:{title:"c5" body:"the body" icon:"concept.png"}) { id }
    c6:createSub(id:"c6" superConceptId:"c4" input:{title:"c6" body:"the body" icon:"concept.png"}) { id }
    c7:createSub(id:"c7" superConceptId:"c4" input:{title:"c7" body:"the body" icon:"concept.png"}) { id }
    c8:createSub(id:"c8" superConceptId:"c6" input:{title:"c8" body:"the body" icon:"concept.png"}) { id }
  }
	Position {
    p1:createForConcept(id:"p1" conceptId:"c2" input:{title:"p1" body:"the body"}) { id }
    p2:createForConcept(id:"p2" conceptId:"c7" input:{title:"p2" body:"the body"}) { id }
    p3:createResponse(id:"p3" contextPositionId:"p2" input:{title:"p3" body:"the body"}) { id }
	}
	Event {
    e1:createInSpace(id:"e1" spaceId:"1" input:{title:"e1" body:"body" datetime:"2007"}) { id }
    e2:createForConcept(id:"e2" conceptId:"c3" input:{title:"e2" body:"body" datetime:"2011-01-01"}) { id }
	}
}
`  