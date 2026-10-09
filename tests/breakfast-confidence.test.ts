import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {breakfastConfidence,breakfastDisclosure} from "../lib/breakfast-confidence";
describe("breakfast recommendation evidence",()=>{
 it("recognizes explicit breakfast service",()=>assert.equal(breakfastConfidence({title:"Some Cafe",category:"Food & Drink",breakfast:"yes"}),"explicit"));
 it("recognizes breakfast-specific venues",()=>assert.equal(breakfastConfidence({title:"Downtown Pancakes",category:"Food & Drink"}),"likely"));
 it("does not claim a coffee shop has a breakfast menu",()=>assert.equal(breakfastConfidence({title:"City Coffee",category:"Food & Drink"}),"possible"));
 it("does not recommend unrelated nightlife as breakfast",()=>assert.equal(breakfastConfidence({title:"Cocktail Lounge",category:"Nightlife"}),"unlikely"));
 it("includes verification caveat",()=>assert.match(breakfastDisclosure("possible"),/not verified/));
});
