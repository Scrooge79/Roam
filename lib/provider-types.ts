export type PublicEvent={id:string;name:string;date:string|null;url:string|null;venue:string|null;image:string|null;source:string};
export type PublicPlace={id:string;name:string;category:string;latitude:number;longitude:number;address:string|null;website:string|null;openingHours:string|null;image?:string|null;cuisine?:string|null;breakfast?:string|null;sourceUrl:string;lastFetchedAt?:string|null};
export type DiscoveryResponse={places:PublicPlace[];events:PublicEvent[];warnings:string[];retrievedAt:string;location:{lat:number;lng:number}};
function validCoord(n:number,max:number){return Number.isFinite(n)&&Math.abs(n)<=max}
export function validLocation(lat:number,lng:number){return validCoord(lat,90)&&validCoord(lng,180)}
export function cleanPlace(p:PublicPlace):PublicPlace|null{
 if(!p.id||!p.name?.trim()||!validLocation(p.latitude,p.longitude))return null;
 return {...p,name:p.name.trim(),category:p.category||"Attractions"};
}
export function cleanEvent(e:PublicEvent):PublicEvent|null{
 if(!e.id||!e.name?.trim())return null;
 if(e.date&&!Number.isFinite(Date.parse(e.date)))return null;
 return {...e,name:e.name.trim()};
}
