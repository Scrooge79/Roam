import {describe,it} from "node:test";
import {strict as assert} from "node:assert";
import {milesBetween,validCoordinates,isWithinRadius} from "./geo";
describe("geographic distance",()=>{
 it("handles same location",()=>assert.equal(milesBetween({lat:35.99,lng:-78.9},{lat:35.99,lng:-78.9}),0));
 it("rejects invalid coordinates",()=>assert.equal(validCoordinates({lat:91,lng:0}),false));
 it("filters radius",()=>assert.equal(isWithinRadius({lat:35.99,lng:-78.9},{lat:35.99,lng:-78.9},1),true));
});
