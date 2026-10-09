import {NextRequest,NextResponse} from "next/server";
export const dynamic="force-dynamic";
function numeric(value:string|null,min:number,max:number){if(value===null)return null;const n=Number(value);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams;
 const lat=numeric(p.get("lat"),-90,90),lng=numeric(p.get("lng"),-180,180);
 const city=(p.get("city")||"").trim(),stateCode=(p.get("stateCode")||"").trim().toUpperCase();
 const radius=numeric(p.get("radius"),1,100)??25;
 if((lat===null)!==(lng===null))return NextResponse.json({error:"Both latitude and longitude are required"},{status:400});
 if(lat===null&&(!city||city.length>100||!/^[\p{L}\p{M}0-9 .,'-]+$/u.test(city)))return NextResponse.json({error:"Enter a valid city or enable location"},{status:400});
 if(stateCode&&!/^[A-Z]{2}$/.test(stateCode))return NextResponse.json({error:"Invalid state code"},{status:400});
 const key=process.env.TICKETMASTER_API_KEY;
 if(!key)return NextResponse.json({configured:false,events:[],message:"Live events provider not configured"});
 const url=new URL("https://app.ticketmaster.com/discovery/v2/events.json");
 url.searchParams.set("apikey",key);
 if(lat!==null&&lng!==null){url.searchParams.set("latlong",lat+","+lng);url.searchParams.set("radius",String(radius));url.searchParams.set("unit","miles")}
 else{url.searchParams.set("city",city);if(stateCode)url.searchParams.set("stateCode",stateCode)}
 url.searchParams.set("size","30");url.searchParams.set("sort","date,asc");url.searchParams.set("startDateTime",new Date().toISOString());
 try{
  const res=await fetch(url,{next:{revalidate:300}});
  if(!res.ok)return NextResponse.json({error:"Event provider unavailable",events:[]},{status:502});
  const json=await res.json();
  const events=(json._embedded?.events??[]).map((e:any)=>({
   id:String(e.id),name:String(e.name??"Event"),url:typeof e.url==="string"?e.url:null,
   date:e.dates?.start?.dateTime??e.dates?.start?.localDate??null,
   venue:e._embedded?.venues?.[0]?.name??null,
   image:e.images?.find((i:any)=>i.ratio==="16_9")?.url??null,source:"Ticketmaster"
  }));
  return NextResponse.json({configured:true,events,updatedAt:new Date().toISOString()});
 }catch{return NextResponse.json({error:"Unable to reach event provider",events:[]},{status:502})}
}
