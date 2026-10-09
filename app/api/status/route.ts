import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export function GET(){
 return NextResponse.json({
  service:"roam",
  state:"prototype",
  providers:{
   ticketmaster:{configured:Boolean(process.env.TICKETMASTER_API_KEY),status:"not_probed"},
   openstreetmap:{configured:true,status:"not_probed"},
   geocoding:{configured:true,status:"not_probed"},
   database:{configured:Boolean(process.env.DATABASE_URL),status:"not_probed"}
  },
  notice:"Configuration status only. This endpoint does not verify provider health or expose credentials."
 },{headers:{"Cache-Control":"no-store"}});
}
