import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {sourcePhoto} from "../lib/venue-photo";
describe("venue photo sourcing",()=>{
 it("accepts a trusted Wikimedia upload",()=>assert.equal(sourcePhoto({image:"https://upload.wikimedia.org/wikipedia/commons/a/a1/cafe.jpg"}),"https://upload.wikimedia.org/wikipedia/commons/a/a1/cafe.jpg"));
 it("converts a Commons file tag",()=>assert.ok(sourcePhoto({wikimedia_commons:"File:Sample cafe.jpg"})?.includes("Sample%20cafe.jpg")));
 it("rejects arbitrary external images",()=>assert.equal(sourcePhoto({image:"https://example.com/stock.jpg"}),null));
 it("rejects javascript URLs",()=>assert.equal(sourcePhoto({image:"javascript:alert(1)"}),null));
});
