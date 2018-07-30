export default `mutation mind_space {
	m1:Mind {
		m:create(id:"1", input:{title:"self"}) { id }
	}
	m2:Space {
		s:createInMind(id:"1" mindId:"1" input:{title:"Ideas"}) { id }
	}
  m3:Concept {
    c1:createInSpace(id:"c1" spaceId:"1" input:{title:"c1" body:"the body" icon:"concept.png"}) { id }
    c2:createInSpace(id:"c2" spaceId:"1" input:{title:"c2" body:"the body" icon:"concept.png"}) { id }
    c3:createSubConcept(id:"c3" superConceptId:"c1" input:{title:"c3" body:"the body" icon:"concept.png"}) { id }
    c4:createSubConcept(id:"c4" superConceptId:"c1" input:{title:"c4" body:"the body" icon:"concept.png"}) { id }
    c5:createSubConcept(id:"c5" superConceptId:"c3" input:{title:"c5" body:"the body" icon:"concept.png"}) { id }
    c6:createSubConcept(id:"c6" superConceptId:"c1" input:{title:"c6" body:"the body" icon:"concept.png"}) { id }
    c1c5:addSubConcept(id:"c1" subConceptId:"c5")
    c6c2:addSubConcept(id:"c6" subConceptId:"c2")
    c1dc5:removeSubConcept(id:"c1" subConceptId:"c5")
	}
	m4:Idea {
    p1:createForConcept(id:"p1" conceptId:"c2" input:{title:"p1" body:"the body"}) { id }
    p2:createForConcept(id:"p2" conceptId:"c5" input:{title:"p2" body:"the body"}) { id }
    p3:createResponse(id:"p3" contextIdeaId:"p2" input:{title:"p3" body:"the body"}) { id }
    p4:createResponse(id:"p4" contextIdeaId:"p1" input:{title:"p4" body:"the body"}) { id }
    p5:createResponse(id:"p5" contextIdeaId:"p3" input:{title:"p5" body:"the body"}) { id }
    p6:createResponse(id:"p6" contextIdeaId:"p3" input:{title:"p6" body:"the body"}) { id }
	}
	m5:Event {
		e1:createInSpace(id:"e1" spaceId:"1" input:{title:"e1" body:"body" datetime:"2007"}) { id }
		e2:createForConcept(id:"e2" conceptId:"c3" input:{title:"e2" body:"body" datetime:"2011-01-01"}) { id }
    eu:createInSpace(id:"eu" spaceId:"1" input:{title:"union" body:"union" datetime:"2010-07-17"}) { id }
    eo1:createInSpace(id:"eo1" spaceId:"1" input:{title:"birth" body:"birth" datetime:"2011-12-12"}) { id }
    eo2:createInSpace(id:"eo2" spaceId:"1" input:{title:"eo2" body:"birth" datetime:"2017-06-28"}) { id }
	}
  m6:Person {
    p1:createInSpace(id:"person1" spaceId:"1" input:{title:"person1"}) { id }
    p2:createForConcept(id:"person2" conceptId:"c3" input:{title:"person2"}) { id }
    p3:createAsIdeaSource(id:"person3" ideaId:"p1" input:{title:"person3"}) { id }
    p4:createAsIdeaSubject(id:"person4" ideaId:"p2" input:{title:"person4"}) { id }
    u:createUnion(person1:"person3" person2:"person4" eventId:"eu")
    o1:createOffspring(parent1:"person3" parent2:"person4" childId:"person1" eventId:"eo1")
    o2:createOffspring(parent1:"person3" parent2:"person4" childId:"person2" eventId:"eo2")
  }
  m7:Item {
    i1:createInSpace(id:"i1" spaceId:"1" classConceptId:"c2" input:{title:"i1"}) { id }
    i2:createInstance(id:"i2" classConceptId:"c3" input:{title:"i2"}) { id }
    i3:createInContainer(id:"i3" containerItemId:"i1" classConceptId:"c4" input:{title:"i3"}) { id }
  }
  m8:Location {
    l1:createInSpace(id:"l1" spaceId:"1" input:{title:"l1"}) { id }
    l2:createForConcept(id:"l2" conceptId:"c6" input:{title:"l2"}) { id }
    l3:createWithinLocation(id:"l3" outerLocationId:"l2" input:{title:"l3"}) { id }
  }
  m9:Collection {
    col1:createInSpace(id:"col1" spaceId:"1" classConceptId:"c4" input:{title:"col1"}) { id }
    col2:createInstance(id:"col2" classConceptId:"c5" input:{title:"col2"}) { id }
  }
  m10:Item {
    i4:createAtLocation(id:"i4" locationId:"l2" classConceptId:"c4" input:{title:"i4"}) { id }
    i5:createWithinCollection(id:"i5" collectionId:"col2" classConceptId:"c4" input:{title:"i5"}) { id }
  }
  m11:Event {
    e3:createForCollection(id:"e3" collectionId:"col2" input:{title:"e3" datetime:"2018-01-01"}) { id }
    e4:createForIdea(id:"e4" ideaId:"p3" input:{title:"e4" datetime:"2018-01-01"}) { id }
    e5:createForItem(id:"e5" itemId:"i3" input:{title:"e5" datetime:"2018-01-01"}) { id }
    e6:createForPerson(id:"e6" personId:"person3" input:{title:"e6" datetime:"2018-01-01"}) { id }
  }
  m12:Person {
    p5:createAtLocation(id:"p5" locationId:"l3" input:{title:"p5"}) { id }
    p5e:addEvent(id:"person3" eventId:"e5")
  }
}
`  