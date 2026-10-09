import {NextResponse} from "next/server";
export function GET(){return NextResponse.json({status:"ok",service:"roam",liveData:false,version:"0.1.0"});}
