import type {RichPlace} from "./google-places";
export type ProviderReadiness={ready:boolean;issues:string[]};
export function checkRichPlace(place:RichPlace):ProviderReadiness{
 const issues:string[]=[];
 if(!place.id||!place.name.trim())issues.push("Missing venue identity");
 if(!Number.isFinite(place.latitude)||!Number.isFinite(place.longitude)||Math.abs(place.latitude)>90||Math.abs(place.longitude)>180)issues.push("Invalid coordinates");
 if(!place.weekdayDescriptions.length)issues.push("No detailed opening hours");
 if(!place.photoName)issues.push("No photo metadata");
 return {ready:issues.length===0,issues};
}
export function richPlaceCoverage(places:RichPlace[]){
 return {total:places.length,withHours:places.filter(p=>p.weekdayDescriptions.length>0).length,withPhotos:places.filter(p=>Boolean(p.photoName)).length,withOpenStatus:places.filter(p=>p.openNow!==null).length};
}
