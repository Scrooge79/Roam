/** Explicit server-only controls for richer business data.
 * The default is OFF even if a Google Places API key is present.
 */
export type RichProviderMode="off"|"test";
export function richProviderMode():RichProviderMode{
 return process.env.ROAM_RICH_PROVIDER_MODE==="test"?"test":"off";
}
export function richProviderEnabled():boolean{
 return richProviderMode()==="test"&&Boolean(process.env.GOOGLE_PLACES_API_KEY);
}
export function richProviderBudget(){
 const value=Number(process.env.ROAM_RICH_PROVIDER_MAX_DAILY_REQUESTS??"0");
 return Number.isSafeInteger(value)&&value>0&&value<=100?value:0;
}
export function richProviderReadiness(){
 const issues:string[]=[];
 if(!process.env.GOOGLE_PLACES_API_KEY)issues.push("Google Places API key not configured");
 if(richProviderMode()==="off")issues.push("Rich provider rollout disabled");
 if(richProviderBudget()===0)issues.push("Daily request limit not configured");
 return {configured:Boolean(process.env.GOOGLE_PLACES_API_KEY),mode:richProviderMode(),issues};
}
