import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {coverageCsv} from "../lib/coverage-export";
describe("coverage export",()=>{
 it("includes headers and city values",()=>{const csv=coverageCsv([{city:"Durham, NC",coverage:{places:12,events:0,withListedHours:4,withWebsite:3,unknownHours:8,warnings:[]}}]);assert.ok(csv.includes('"Durham, NC"'));assert.ok(csv.includes('"12"'))});
 it("escapes quotes and neutralizes formulas",()=>{const csv=coverageCsv([{city:'="danger", NC',error:'a"b'}]);assert.ok(csv.includes("'="));assert.ok(csv.includes('""danger""'));assert.ok(csv.includes('a""b'))});
});
