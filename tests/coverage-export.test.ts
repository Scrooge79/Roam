import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {coverageCsv} from "../lib/coverage-export";
describe("coverage export",()=>{
 it("includes headers and city values",()=>{const csv=coverageCsv([{city:"Durham, NC",coverage:{places:12,events:0,withListedHours:4,withWebsite:3,unknownHours:8,warnings:[]}}]);assert.match(csv,/Places/);assert.match(csv,/"Durham, NC"/);assert.match(csv,/"12"/)});
 it("escapes CSV injection and quotes as data",()=>{const csv=coverageCsv([{city:'="danger", NC',error:'a"b'}]);assert.match(csv,/'?="danger"/);assert.match(csv,/'a""b'/)});
});
