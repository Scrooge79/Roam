import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {retrievalFreshness,freshnessDescription,sourceDisclosure} from "../lib/source-confidence";
describe("source reliability labels",()=>{
 const now=new Date("2026-10-08T20:00:00Z");
 it("labels recent retrievals",()=>assert.equal(retrievalFreshness("2026-10-08T19:30:00Z",now),"recently_retrieved"));
 it("labels older retrievals",()=>assert.equal(retrievalFreshness("2026-10-01T19:30:00Z",now),"older_retrieval"));
 it("does not accept future or invalid timestamps",()=>{assert.equal(retrievalFreshness("invalid",now),"unknown");assert.equal(retrievalFreshness("2026-10-09T00:00:00Z",now),"unknown")});
 it("renders understandable age",()=>assert.match(freshnessDescription("2026-10-08T18:00:00Z",now),/2h/));
 it("includes attribution caveats",()=>assert.match(sourceDisclosure("OpenStreetMap"),/outdated/));
});
