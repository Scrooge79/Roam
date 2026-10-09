import {NextRequest,NextResponse} from "next/server";
export function middleware(request:NextRequest){
 if(!request.nextUrl.pathname.startsWith("/coverage"))return NextResponse.next();
 const user=process.env.ROAM_ADMIN_USER,pass=process.env.ROAM_ADMIN_PASSWORD;
 if(!user||!pass){
  return new NextResponse("Operations dashboard is not configured.",{status:503,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
 }
 const authorization=request.headers.get("authorization")??"";
 if(!authorization.startsWith("Basic "))return new NextResponse("Authentication required.",{status:401,headers:{"WWW-Authenticate":'Basic realm="ROAM Operations"',"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
 let decoded="";
 try{decoded=atob(authorization.slice(6))}catch{}
 const separator=decoded.indexOf(":");
 const suppliedUser=separator<0?"":decoded.slice(0,separator),suppliedPass=separator<0?"":decoded.slice(separator+1);
 if(suppliedUser!==user||suppliedPass!==pass)return new NextResponse("Unauthorized.",{status:401,headers:{"WWW-Authenticate":'Basic realm="ROAM Operations"',"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
 const response=NextResponse.next();response.headers.set("Cache-Control","no-store");response.headers.set("X-Robots-Tag","noindex, nofollow");return response;
}
export const config={matcher:["/coverage/:path*"]};
