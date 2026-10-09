import {NextRequest,NextResponse} from "next/server";
export const dynamic="force-dynamic";
type OsmElement={type:string;id:number;lat?:number;lon?:number;center?:{lat:number;lon:number};tags?:Record<string,string>};
function numberInRange(s:string|null,min:number,max:number){const n=Number(s);return s!==null&&Number.isFinite(n)&&n>=min&&n<=max?n:null}
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams;
 const lat=numberInRange(q.get("lat"),-90,90),lng=numberInRange(q.get("lng"),-180,180);
 if(lat===null||lng===null)return NextResponse.json({error:"Valid coordinates required"},{status:400});
 const radius=numberInRange(q.get("radius"),250,3000)??1800;
 const query=`[out:json][timeout:18];(nwr(around:${Math.round(radius)},${lat},${lng})["amenity"~"^(restaurant|cafe|bar|pub|fast_food|cinema|theatre|arts_centre|nightclub)$"];nwr(around:${Math.round(radius)},${lat},${lng})["leisure"~"^(bowling_alley|fitness_centre|escape_game|miniature_golf)$"];nwr(around:${Math.round(radius)},${lat},${lng})["tourism"~"^(museum|gallery|attraction)$"];);out center 90;`;
 try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),23000);
  let response:Response;
  try{response=await fetch("https://overpass.kumi.systems/api/interpreter",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"RoamDiscoveryPrototype/0.1 (OpenStreetMap attribution in UI)"},body:new URLSearchParams({data:query}),signal:controller.signal,next:{revalidate:1800}})}finally{clearTimeout(timeout)}
  if(!response.ok)return NextResponse.json({error:"Places provider temporarily unavailable"},{status:503});
  const json=await response.json();const items=(json.elements??[] as OsmElement[]).filter((x:OsmElement)=>x.tags?.name).map((x:OsmElement)=>{
   const t=x.tags??{},a=t.amenity??t.leisure??t.tourism??"attraction",latitude=x.lat??x.center?.lat,longitude=x.lon??x.center?.lon;
   if(latitude===undefined||longitude===undefined)return null;
   const category=["restaurant","cafe","fast_food"].includes(a)?"Food & Drink":["bar","pub","nightclub"].includes(a)?"Nightlife":["museum","gallery","attraction"].includes(a)?"Attractions":"Activities";
   return {id:`${x.type}:${x.id}`,name:t.name,category,latitude,longitude,address:[t["addr:housenumber"],t["addr:street"]].filter(Boolean).join(" ")||null,website:t.website??t["contact:website"]??null,openingHours:t.opening_hours??null,sourceUrl:`https://www.openstreetmap.org/${x.type}/${x.id}`};
  }).filter(Boolean);
  return NextResponse.json({source:"OpenStreetMap contributors",attribution:"© OpenStreetMap contributors",verifiedOpenNow:false,places:items},{headers:{"Cache-Control":"public, s-maxage=1800, stale-while-revalidate=3600"}});
 }catch{return NextResponse.json({error:"Places provider timed out or unavailable"},{status:503})}
}
