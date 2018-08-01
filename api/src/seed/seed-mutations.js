export default `mutation mind_space {
	m1:Mind {
		m:post(input:{id:"test", title:"demo"}) { id }
	}
	m2:Space {
		s:post_in_mind(input:{id:"1", sourceId:"test", title:"Demo"}) { id }
	}
  m3:Concept {
    c1:post_in_space(input:{id:"c1" sourceId:"1" title:"c1" body:"the body" icon:"concept.png"}) { id }
    c2:post_in_space(input:{id:"c2" sourceId:"1" title:"c2" body:"the body" icon:"concept.png"}) { id }
    c3:post_sub_concept(input:{id:"c3" sourceId:"c1" title:"c3" body:"the body" icon:"concept.png"}) { id }
    c4:post_sub_concept(input:{id:"c4" sourceId:"c1" title:"c4" body:"the body" icon:"concept.png"}) { id }
    c5:post_sub_concept(input:{id:"c5" sourceId:"c3" title:"c5" body:"the body" icon:"concept.png"}) { id }
    c6:post_sub_concept(input:{id:"c6" sourceId:"c1" title:"c6" body:"the body" icon:"concept.png"}) { id }
    c1c5:post_sub_concept(input:{id:"c1" sourceId:"c5"}) { id }
    c6c2:post_sub_concept(input:{id:"c6" sourceId:"c2"}) { id }
    c1dc5:post_sub_concept(input:{remove:true, id:"c1" sourceId:"c5"}) { id }
	}
	m4:Idea {
    p1:post_described_by_concept(input:{id:"p1" sourceId:"c2" title:"p1" body:"the body"}) { id }
    p2:post_described_by_concept(input:{id:"p2" sourceId:"c5" title:"p2" body:"the body"}) { id }
    p3:post_sub_idea(input:{id:"p3" sourceId:"p2" title:"p3" body:"the body"}) { id }
    p4:post_sub_idea(input:{id:"p4" sourceId:"p1" title:"p4" body:"the body"}) { id }
    p5:post_sub_idea(input:{id:"p5" sourceId:"p3" title:"p5" body:"the body"}) { id }
    p6:post_sub_idea(input:{id:"p6" sourceId:"p3" title:"p6" body:"the body"}) { id }
	}
	m5:Event {
		e1:post_in_space(input:{id:"e1" sourceId:"1" title:"e1" body:"body" datetime:"2007"}) { id }
		e2:post_described_by_concept(input:{id:"e2" sourceId:"c3" title:"e2" body:"body" datetime:"2011-01-01"}) { id }
    eu:post_in_space(input:{id:"eu" sourceId:"1" title:"union" body:"union" datetime:"2010-07-17"}) { id }
    eo1:post_in_space(input:{id:"eo1" sourceId:"1" title:"birth" body:"birth" datetime:"2011-12-12"}) { id }
    eo2:post_in_space(input:{id:"eo2" sourceId:"1" title:"eo2" body:"birth" datetime:"2017-06-28"}) { id }
	}
	m6:Person {
    p1:post_in_space(input:{id:"person1" sourceId:"1" title:"person1"}) { id }
    p2:post_described_by_concept(input:{id:"person2" sourceId:"c3" title:"person2"}) { id }
    p3:post_source_of_idea(input:{id:"person3" sourceId:"p1" title:"person3"}) { id }
    p4:post_subject_of_idea(input:{id:"person4" sourceId:"p2" title:"person4"}) { id }
    u:post_union(person1:"person3" person2:"person4" eventId:"eu")
    o1:post_offspring(parent1:"person3" parent2:"person4" childId:"person1" eventId:"eo1")
    o2:post_offspring(parent1:"person3" parent2:"person4" childId:"person2" eventId:"eo2")
	}
	m7:Item {
    i1:post_in_space(input:{id:"i1" sourceId:"1" classId:"c2" title:"i1"}) { id }
    i2:post_instance_of_concept(input:{id:"i2" sourceId:"c3" title:"i2"}) { id }
    i3:post_in_item(input:{id:"i3" sourceId:"i1" classId:"c4" title:"i3"}) { id }
	}
	m8:Location {
    l1:post_in_space(input:{id:"l1" sourceId:"1" title:"l1"}) { id }
    l2:post_described_by_concept(input:{id:"l2" sourceId:"c6" title:"l2"}) { id }
    l3:post_sub_location(input:{id:"l3" sourceId:"l2" title:"l3"}) { id }
	}
	m9:Collection {
    col1:post_in_space(input:{id:"col1" sourceId:"1" classId:"c4" title:"col1"}) { id }
    col2:post_instance_of_concept(input:{id:"col2" sourceId:"c5" title:"col2"}) { id }
	}
	m10:Item {
    i4:post_at_location(input:{id:"i4" sourceId:"l2" classId:"c4" title:"i4"}) { id }
    i5:post_in_collection(input:{id:"i5" sourceId:"col2" classId:"c4" title:"i5"}) { id }
	}
	m11:Event {
    e3:post_timeline_of_collection(input:{id:"e3" sourceId:"col2" title:"e3" datetime:"2018-01-01"}) { id }
    e4:post_subject_of_idea(input:{id:"e4" sourceId:"p3" title:"e4" datetime:"2018-01-01"}) { id }
    e5:post_timeline_of_item(input:{id:"e5" sourceId:"i3" title:"e5" datetime:"2018-01-01"}) { id }
    e6:post_timeline_of_person(input:{id:"e6" sourceId:"person3" title:"e6" datetime:"2018-01-01"}) { id }
	}
	m12:Person {
    p5:post_at_location(input:{id:"p5" sourceId:"l3" title:"p5"}) { id }
    p5e:post_timeline_of_event(input:{id:"person3" sourceId:"e5"}) { id }
	}
}
`  