import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {assessOpeningHours} from "../lib/opening-hours";
describe("conservative opening hours",()=>{
 const monday=new Date("2026-10-05T16:00:00Z"); // 12:00 in New York
 it("recognizes 24/7",()=>assert.equal(assessOpeningHours("24/7","America/New_York",monday).state,"likely_open"));
 it("evaluates weekday ranges",()=>assert.equal(assessOpeningHours("Mo-Fr 09:00-17:00","America/New_York",monday).state,"likely_open"));
 it("evaluates closed outside ranges",()=>assert.equal(assessOpeningHours("Sa-Su 09:00-17:00","America/New_York",monday).state,"likely_closed"));
 it("does not guess unknown hours",()=>assert.equal(assessOpeningHours("Mo-Fr 09:00-17:00; PH off","America/New_York",monday).state,"unknown"));
 it("does not guess without timezone",()=>assert.equal(assessOpeningHours("24/7",null,monday).state,"unknown"));
 it("handles overnight windows",()=>assert.equal(assessOpeningHours("Mo 20:00-02:00","America/New_York",new Date("2026-10-06T05:00:00Z")).state,"likely_open"));
});
