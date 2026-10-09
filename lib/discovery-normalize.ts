import {safeHttpUrl,type DiscoveryRecord} from "./discovery-engine";
export type RawPlace={id:string;name:string;category:string;latitude:number;longitude:number;sourceUrl?:string|null;address?:string|null};
export type RawEvent={id:string;name:string;date?:string|null;url?:string|null;venue?:string|null};
export function normalizePlace(place:RawPlace):DiscoveryRecord|null{
 if(!place.id||!place.name?.trim()||!Number.isFinite(place.latitude)||!Number.isFinite(place.longitude)||Math.abs(place.latitude)>90||Math.abs(place.longitude)>180)return null;
 return {id:"osm:"+place.id,kind:"place",title:place.name.trim(),category:place.category||"Attractions",source:"OpenStreetMap",latitude:place.latitude,longitude:place.longitude,sourceUrl:safeHttpUrl(place.sourceUrl)};
}
export function normalizeEvent(event:RawEvent):DiscoveryRecord|null{
 if(!event.id||!event.name?.trim())return null;
 const timestamp=event.date&&Date.parse(event.date);
 if(event.date&&(!timestamp||!Number.isFinite(timestamp)))return null;
 return {id:"ticketmaster:"+event.id,kind:"event",title:event.name.trim(),category:"Events",source:"Ticketmaster",startsAt:event.date||null,sourceUrl:safeHttpUrl(event.url)};
}
