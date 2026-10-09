import {NextRequest,NextResponse} from "next/server";
import {demoListings} from "../../../lib/discovery";
import {searchListings} from "../../../lib/search";
export function GET(req:NextRequest){
 const p=req.nextUrl.searchParams;
 const q=(p.get("q")||"").slice(0,120);
 const category=p.get("category")||"All";
 const allowed=["All","Events","Food & Drink","Activities","Nightlife","Outdoors"];
 if(!allowed.includes(category))return NextResponse.json({error:"Invalid category"},{status:400});
 const results=searchListings(demoListings,{query:q,category:category as "All"|"Events"|"Food & Drink"|"Activities"|"Nightlife"|"Outdoors"});
 return NextResponse.json({mode:"demo",verified:false,count:results.length,results},{headers:{"Cache-Control":"public, max-age=60"}});
}
