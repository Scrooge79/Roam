#!/usr/bin/env node
// Read-only production smoke test. Does not require provider credentials.
const base=(process.env.ROAM_BASE_URL||"https://roam-gold.vercel.app").replace(/\/$/,"");
const checks=[
 {name:"homepage",path:"/",verify:async r=>r.ok&&(await r.text()).includes("roam")},
 {name:"status endpoint",path:"/api/status",verify:async r=>r.ok&&(await r.json()).service==="roam"},
 {name:"invalid coordinates rejected",path:"/api/unified?lat=999&lng=-78",verify:async r=>r.status===400},
 {name:"invalid location rejected",path:"/api/geocode?q=a",verify:async r=>r.status===400},
 {name:"admin dashboard fail closed",path:"/coverage",verify:async r=>[401,503].includes(r.status)}
];
let failed=0;
for(const check of checks){
 try{
  const response=await fetch(base+check.path,{signal:AbortSignal.timeout(15000),redirect:"manual"});
  const passed=await check.verify(response);
  console.log((passed?"PASS":"FAIL")+" "+check.name+" HTTP "+response.status);
  if(!passed)failed++;
 }catch(error){failed++;console.error("FAIL "+check.name+": "+String(error))}
}
if(failed){console.error(failed+" smoke check(s) failed");process.exitCode=1}
else console.log("All production smoke checks passed");
