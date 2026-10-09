/** Optional Google Places (New) provider. Disabled until a server-side key is configured.
 * Calls use explicit field masks to control billable data usage.
 * Follow Google Maps Platform policies on attribution, retention and photo display.
 */
export type RichPlace={
 id:string;name:string;address:string|null;latitude:number;longitude:number;
 website:string|null;googleMapsUri:string|null;
 weekdayDescriptions:string[];openNow:boolean|null;photoName:string|null;
};
type GooglePlace={
 id?:string;displayName?:{text?:string};formattedAddress?:string;
 location?:{latitude?:number;longitude?:number};websiteUri?:string;googleMapsUri?:string;
 regularOpeningHours?:{weekdayDescriptions?:string[];openNow?:boolean};
 photos?:Array<{name?:string}>;
};
export async function nearbyRichPlaces(lat:number,lng:number,radius:number):Promise<RichPlace[]>{
 const key=process.env.GOOGLE_PLACES_API_KEY;
 if(!key)return [];
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return [];
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
 try{
  const response=await fetch("https://places.googleapis.com/v1/places:searchNearby",{
   method:"POST",signal:controller.signal,
   headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,
    "X-Goog-FieldMask":"places.id,places.displayName,places.formattedAddress,places.location,places.websiteUri,places.googleMapsUri,places.regularOpeningHours.weekdayDescriptions,places.regularOpeningHours.openNow,places.photos.name"},
   body:JSON.stringify({includedTypes:["restaurant","cafe","bakery","bar","museum"],maxResultCount:20,
    locationRestriction:{circle:{center:{latitude:lat,longitude:lng},radius:Math.min(3000,Math.max(250,radius))}}}),
   cache:"no-store"
  });
  if(!response.ok)return [];
  const payload=await response.json() as {places?:GooglePlace[]};
  return (payload.places??[]).filter(p=>p.id&&p.displayName?.text&&p.location?.latitude!==undefined&&p.location?.longitude!==undefined).map(p=>({
   id:p.id!,name:p.displayName!.text!,address:p.formattedAddress??null,
   latitude:p.location!.latitude!,longitude:p.location!.longitude!,
   website:p.websiteUri??null,googleMapsUri:p.googleMapsUri??null,
   weekdayDescriptions:p.regularOpeningHours?.weekdayDescriptions??[],
   openNow:typeof p.regularOpeningHours?.openNow==="boolean"?p.regularOpeningHours.openNow:null,
   photoName:p.photos?.[0]?.name??null
  }));
 }catch{return []}finally{clearTimeout(timeout)}
}
