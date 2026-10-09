import type {DiscoveryRecord} from "./discovery-engine";
export type CacheEnvelope<T>={value:T;fetchedAt:string;expiresAt:string;source:string};
export function makeEnvelope<T>(value:T,source:string,ttlSeconds:number,now=new Date()):CacheEnvelope<T>{
 if(!Number.isFinite(ttlSeconds)||ttlSeconds<1||ttlSeconds>86400*30)throw Error("Invalid cache TTL");
 return {value,source,fetchedAt:now.toISOString(),expiresAt:new Date(now.getTime()+ttlSeconds*1000).toISOString()};
}
export function cacheState<T>(envelope:CacheEnvelope<T>,now=new Date()):"fresh"|"stale"|"invalid"{
 const fetched=Date.parse(envelope.fetchedAt),expires=Date.parse(envelope.expiresAt);
 if(!Number.isFinite(fetched)||!Number.isFinite(expires)||expires<=fetched)return "invalid";
 return now.getTime()<expires?"fresh":"stale";
}
export function sanitizeRecords(records:DiscoveryRecord[]):DiscoveryRecord[]{
 return records.filter(x=>Boolean(x.id&&x.title&&x.source)&&(!x.startsAt||Number.isFinite(Date.parse(x.startsAt))));
}
