import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {dedupeRecords,rankRecord,safeHttpUrl,type DiscoveryRecord} from "../lib/discovery-engine";
import {cacheState,makeEnvelope} from "../lib/cache-policy";
import {buildSuggestedPlan} from "../lib/night-planner";
import {validLocation,cleanPlace,cleanEvent} from "../lib/provider-types";
describe("discovery quality",()=>{
 it("deduplicates matching records",()=>{const a:DiscoveryRecord={id:"a",kind:"place",title:"Test Cafe",category:"Food & Drink",source:"osm",latitude:35.99,longitude:-78.9};assert.equal(dedupeRecords([a,{...a,id:"b"}]).length,1)});
 it("ranks nearby places higher",()=>{const a:DiscoveryRecord={id:"a",kind:"place",title:"Cafe",category:"Food & Drink",source:"osm"};assert.ok(rankRecord({...a,distanceMiles:1})>rankRecord({...a,distanceMiles:10}))});
 it("rejects unsafe URLs",()=>{assert.equal(safeHttpUrl("javascript:alert(1)"),null);assert.equal(safeHttpUrl("https://example.com/"),"https://example.com/")});
 it("recognizes stale cache",()=>{const now=new Date("2026-10-08T12:00:00Z");const c=makeEnvelope([1],"test",60,now);assert.equal(cacheState(c,new Date("2026-10-08T12:00:30Z")),"fresh");assert.equal(cacheState(c,new Date("2026-10-08T12:02:00Z")),"stale")});
 it("validates coordinates",()=>{assert.equal(validLocation(91,0),false);assert.equal(validLocation(35.99,-78.9),true);assert.equal(cleanPlace({id:"x",name:"",category:"Food & Drink",latitude:35,longitude:-78}),null)});
 it("rejects invalid event date",()=>assert.equal(cleanEvent({id:"x",name:"Show",date:"not-a-date",url:null,venue:null,image:null,source:"test"}),null));
 it("builds bounded itinerary",()=>{const p=buildSuggestedPlan([{id:"a",title:"Cafe",kind:"place",category:"Food & Drink",distance:2},{id:"b",title:"Arcade",kind:"place",category:"Activities",distance:3}],{hours:3,vibe:"balanced",startAt:"2026-10-08T19:00:00Z"});assert.ok(p.length>=1&&p.length<=2)});
});
