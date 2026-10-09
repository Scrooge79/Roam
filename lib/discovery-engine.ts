export type DiscoveryRecord={
 id:string;kind:"place"|"event";title:string;category:string;source:string;
 latitude?:number;longitude?:number;startsAt?:string|null;endsAt?:string|null;
 sourceUrl?:string|null;distanceMiles?:number;verifiedAt?:string|null;
};
function normalize(s:string){return s.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim()}
export function dedupeRecords<T extends DiscoveryRecord>(records:T[]):T[]{
 const seen=new Set<string>();return records.filter(x=>{
  const date=x.startsAt?.slice(0,16)??"";
  const coord=x.latitude!==undefined&&x.longitude!==undefined?`${x.latitude.toFixed(3)}:${x.longitude.toFixed(3)}`:"";
  const key=[x.kind,normalize(x.title),date,coord].join("|");
  if(seen.has(key))return false;seen.add(key);return true;
 });
}
export function rankRecord(x:DiscoveryRecord,now=new Date()):number{
 let score=50;
 if(x.distanceMiles!==undefined&&Number.isFinite(x.distanceMiles))score+=Math.max(-35,25-x.distanceMiles*5);
 if(x.kind==="event"&&x.startsAt){const start=Date.parse(x.startsAt);if(Number.isFinite(start)){const hours=(start-now.getTime())/3600000;if(hours>=0&&hours<=24)score+=22;else if(hours>24&&hours<=72)score+=10;else if(hours<0)score-=30}}
 if(x.verifiedAt){const age=(now.getTime()-Date.parse(x.verifiedAt))/3600000;if(Number.isFinite(age)&&age>=0&&age<24)score+=5}
 return Math.round(score);
}
export function safeHttpUrl(url:string|null|undefined):string|null{
 if(!url)return null;try{const parsed=new URL(url);return parsed.protocol==="https:"||parsed.protocol==="http:"?parsed.href:null}catch{return null}
}
