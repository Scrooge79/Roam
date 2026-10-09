import {NextRequest,NextResponse} from "next/server";
export const dynamic="force-dynamic";
const maxRadius=100;
function num(v:string|null,min:number,max:number){if(v===null)return null;const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams;
 const lat=num(p.get("lat"),-90,90),lng=num(p.get("lng"),-180,180),radius=num(p.get("radius"),1,maxRadius)??25;
 if(lat===null||lng===null)return NextResponse.json({error:"Valid latitude and longitude required"},{status:400});
 const key=process.env.TICKETMASTER_API_KEY;
 if(!key)return NextResponse.json({configured:false,events:[],message:"Live events provider not configured"});
 const u=new URL("https://app.ticketmaster.com/discovery/v2/events.json");
 u.searchParams.set("apikey",key);u.searchParams.set("latlong",lat+","+lng);u.searchParams.set("radius",String(radius));u.searchParams.set("unit","miles");u.searchParams.set("size","30");u.searchParams.set("sort","date,asc");u.searchParams.set("startDateTime",new Date().toISOString());
 try{
  const res=await fetch(u,{next:{revalidate:300}});
  if(!res.ok)return NextResponse.json({error:"Event provider unavailable",events:[]},{status:502});
  const json=await res.json();
  const events=(json._embedded?.events??[]).map((e:any)=>({id:String(e.id),name:String(e.name??"Event"),url:typeof e.url==="string"?e.url:null,date:e.dates?.start?.dateTime??e.dates?.start?.localDate??null,venue:e._embedded?.venues?.[0]?.name??null,image:e.images?.find((i:any)=>i.ratio==="16_9")?.url??null,source:"Ticketmaster"}));
  return NextResponse.json({configured:true,events,updatedAt:new Date().toISOString()});
 }catch{return NextResponse.json({error:"Unable to reach event provider",events:[]},{status:502})}
}
