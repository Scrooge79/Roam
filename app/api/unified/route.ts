import {NextRequest,NextResponse} from "next/server";
import {cleanEvent,cleanPlace,validLocation,type DiscoveryResponse} from "../../../lib/provider-types";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 const lat=Number(req.nextUrl.searchParams.get("lat")),lng=Number(req.nextUrl.searchParams.get("lng"));
 if(!req.nextUrl.searchParams.has("lat")||!req.nextUrl.searchParams.has("lng")||!validLocation(lat,lng))return NextResponse.json({error:"Valid latitude and longitude required"},{status:400});
 const radiusValue=Number(req.nextUrl.searchParams.get("radius")??1800);
 if(!Number.isFinite(radiusValue)||radiusValue<250||radiusValue>3000)return NextResponse.json({error:"Radius must be between 250 and 3000 meters"},{status:400});
 const base=req.nextUrl.origin;const params=new URLSearchParams({lat:String(lat),lng:String(lng)});
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),26000);
 try{
  const results=await Promise.allSettled(["places","events"].map(async name=>{
   const providerParams=new URLSearchParams(params);if(name==="places")providerParams.set("radius",String(radiusValue));
   const res=await fetch(base+"/api/"+name+"?"+providerParams.toString(),{signal:controller.signal,headers:{"Accept":"application/json"},next:{revalidate:300}});
   if(!res.ok)throw Error(name+" unavailable");
   return {name,data:await res.json()};
  }));
  let places:DiscoveryResponse["places"]=[],events:DiscoveryResponse["events"]=[];const warnings:string[]=[];
  for(let i=0;i<results.length;i++){
   const result=results[i],provider=i===0?"places":"events";
   if(result.status==="rejected"){warnings.push(provider+" provider unavailable");continue}
   const d=result.value.data;
   if(provider==="places")places=(Array.isArray(d.places)?d.places:[]).map(cleanPlace).filter((x:DiscoveryResponse["places"][number]|null):x is DiscoveryResponse["places"][number]=>x!==null);
   else{events=(Array.isArray(d.events)?d.events:[]).map(cleanEvent).filter((x:DiscoveryResponse["events"][number]|null):x is DiscoveryResponse["events"][number]=>x!==null);if(d.configured===false)warnings.push("Events provider not configured")}
  }
  const body:DiscoveryResponse={places,events,warnings,retrievedAt:new Date().toISOString(),location:{lat,lng}};
  return NextResponse.json(body,{headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=600"}});
 }finally{clearTimeout(timeout)}
}
