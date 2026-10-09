import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {checkRichPlace,richPlaceCoverage} from "../lib/rich-place-quality";
import type {RichPlace} from "../lib/google-places";
const sample:RichPlace={id:"example",name:"Example Cafe",address:"Durham",latitude:35.99,longitude:-78.9,website:null,googleMapsUri:null,weekdayDescriptions:["Monday: 8:00 AM – 3:00 PM"],openNow:true,photoName:"places/example/photos/example"};
describe("richer venue data quality",()=>{
 it("recognizes complete metadata",()=>assert.equal(checkRichPlace(sample).ready,true));
 it("flags missing photo and hours",()=>assert.deepEqual(checkRichPlace({...sample,weekdayDescriptions:[],photoName:null}).issues,["No detailed opening hours","No photo metadata"]));
 it("counts completeness without inventing details",()=>assert.deepEqual(richPlaceCoverage([sample,{...sample,id:"other",photoName:null,weekdayDescriptions:[],openNow:null}]),{total:2,withHours:1,withPhotos:1,withOpenStatus:1}));
});
