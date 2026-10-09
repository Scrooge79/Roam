/** Explicit server-only controls for richer business data.
 * The default is OFF even if a Google Places API key is present.
 */
export type RichProviderMode="off"|"test";
export function richProviderMode():RichProviderMode{
 return process.env.ROAM_RICH_PROVIDER_MODE==="test"?"test":"off";
}
export function richProviderEnabled():boolean{
 return false; // No billable requests until durable quota enforcement and compliance review.
}
export function richProviderReadiness(){
 const issues:string[]=[];
 if(!process.env.GOOGLE_PLACES_API_KEY)issues.push("Google Places API key not configured");
 if(richProviderMode()==="off")issues.push("Rich provider rollout disabled");
 issues.push("Server-side request quota enforcement not implemented; provider must remain inactive");
 return {configured:Boolean(process.env.GOOGLE_PLACES_API_KEY),mode:richProviderMode(),issues};
}
