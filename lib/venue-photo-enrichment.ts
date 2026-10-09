import {sourcePhoto} from "./venue-photo";
type Tags=Record<string,string>;
type WikidataEntity={claims?:{P18?:Array<{mainsnak?:{datavalue?:{value?:unknown}}}>}};
const wikidataId=(value:string|undefined)=>value&&/^Q[1-9][0-9]{0,11}$/.test(value)?value:null;
/** Optional, bounded enrichment; an upstream failure must never block place discovery. */
export async function enrichVenuePhotos<T extends {tags?:Tags}>(elements:T[]):Promise<Map<string,string>>{
 const ids=[...new Set(elements.map(e=>wikidataId(e.tags?.wikidata)).filter((id):id is string=>Boolean(id)))].slice(0,30);
 const photos=new Map<string,string>();
 if(!ids.length)return photos;
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),4500);
 try{
  const url=new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action","wbgetentities");
  url.searchParams.set("ids",ids.join("|"));
  url.searchParams.set("props","claims");
  url.searchParams.set("format","json");
  url.searchParams.set("origin","*");
  const response=await fetch(url,{signal:controller.signal,next:{revalidate:86400},headers:{"User-Agent":"ROAM-discovery/0.1 (venue imagery metadata)"}});
  if(!response.ok)return photos;
  const data=await response.json() as {entities?:Record<string,WikidataEntity>};
  for(const id of ids){
   const value=data.entities?.[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
   if(typeof value!=="string"||value.length>200)continue;
   const url=sourcePhoto({wikimedia_commons:"File:"+value});
   if(url)photos.set(id,url);
  }
 }catch{/* Wikimedia is optional; keep listings without photos. */}
 finally{clearTimeout(timeout)}
 return photos;
}
