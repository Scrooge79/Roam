import {NextRequest,NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 const query=(req.nextUrl.searchParams.get("q")||"").trim();
 if(query.length<2||query.length>100||/[<>]/.test(query))return NextResponse.json({error:"Enter a valid city or ZIP code"},{status:400});
 try{
  const url=new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q",query);url.searchParams.set("format","jsonv2");url.searchParams.set("limit","3");url.searchParams.set("addressdetails","1");
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
  let response:Response;
  try{response=await fetch(url,{headers:{"User-Agent":"RoamDiscovery/0.1 (contact: https://github.com/Scrooge79/Roam)","Accept-Language":"en"},signal:controller.signal,next:{revalidate:86400}})}finally{clearTimeout(timer)}
  if(!response.ok)return NextResponse.json({error:"Location lookup temporarily unavailable"},{status:503});
  const data=await response.json();
  const results=data.map((x:{lat:string;lon:string;display_name:string;type?:string})=>({lat:Number(x.lat),lng:Number(x.lon),name:x.display_name})).filter((x:{lat:number;lng:number})=>Number.isFinite(x.lat)&&Number.isFinite(x.lng));
  return NextResponse.json({results,attribution:"© OpenStreetMap contributors",source:"Nominatim"},{headers:{"Cache-Control":"public, s-maxage=86400, stale-while-revalidate=86400"}});
 }catch{return NextResponse.json({error:"Location lookup unavailable"},{status:503})}
}
