import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {formatClock,formatMappedHours} from "../lib/hours-display";
describe("12-hour opening hours display",()=>{
 it("formats noon and midnight",()=>{assert.equal(formatClock("12:00"),"12:00 PM");assert.equal(formatClock("00:00"),"12:00 AM")});
 it("formats weekday hours",()=>assert.equal(formatMappedHours("Mo-Fr 09:00-17:30"),"Mon-Fri: 9:00 AM – 5:30 PM"));
 it("formats split service",()=>assert.equal(formatMappedHours("Mo-Fr 11:00-14:00,17:00-22:00"),"Mon-Fri: 11:00 AM – 2:00 PM, 5:00 PM – 10:00 PM"));
 it("does not guess holidays",()=>assert.equal(formatMappedHours("Mo-Su 09:00-17:00; PH off"),null));
 it("formats 24/7",()=>assert.match(formatMappedHours("24/7")||"",/24 hours/));
});
