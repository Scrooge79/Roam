import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {matchesIntent} from "../lib/discovery-intents";
describe("quick discovery categories",()=>{
 it("finds a breakfast cafe without breakfast in its name",()=>assert.equal(matchesIntent({title:"Oak Coffee",category:"Food & Drink",cuisine:"coffee_shop"},"Breakfast"),true));
 it("finds explicit breakfast service",()=>assert.equal(matchesIntent({title:"Morning Place",category:"Food & Drink",breakfast:"yes"},"Breakfast"),true));
 it("does not call every restaurant a breakfast venue",()=>assert.equal(matchesIntent({title:"Steakhouse",category:"Food & Drink"},"Breakfast"),false));
 it("finds nightlife bars under drinks",()=>assert.equal(matchesIntent({title:"The Lounge",category:"Nightlife"},"Drinks"),true));
 it("finds arcades under games",()=>assert.equal(matchesIntent({title:"Downtown Arcade",category:"Activities"},"Games"),true));
});
