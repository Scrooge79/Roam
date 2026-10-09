import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {richProviderEnabled,richProviderReadiness} from "../lib/rich-provider-config";
describe("safe rich provider rollout",()=>{
 it("never enables billable requests in the current implementation",()=>assert.equal(richProviderEnabled(),false));
 it("discloses missing quota enforcement",()=>assert.ok(richProviderReadiness().issues.some(issue=>issue.includes("quota enforcement"))));
});
