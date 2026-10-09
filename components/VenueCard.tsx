"use client";
import {useState} from "react";
import {CalendarDays,MapPin,Navigation,ExternalLink,ImageOff,ChevronDown} from "lucide-react";
import {safeHttpUrl} from "../lib/discovery-engine";
import {breakfastConfidence,breakfastDisclosure} from "../lib/breakfast-confidence";
import {sourceDisclosure,freshnessDescription} from "../lib/source-confidence";
export type VenueResult={id:string;title:string;kind:"place"|"event";category:string;subtitle:string;url:string|null;lat?:number;lng?:number;distance?:number;start?:string|null;image?:string|null;website?:string|null;openingHours?:string|null;lastFetchedAt?:string|null;source:string;cuisine?:string|null;breakfast?:string|null;hoursAssessment?:{state:"likely_open"|"likely_closed"|"unknown";reason:string;timezone:string|null}};
function eventTime(value:string){const d=new Date(value);return Number.isNaN(d.getTime())?"Time not provided":new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:true}).format(d)}
export default function VenueCard({place,breakfastMode}:{place:VenueResult;breakfastMode:boolean}){
 const [details,setDetails]=useState(false),[imageFailed,setImageFailed]=useState(false);
 const image=safeHttpUrl(place.image);
 const website=safeHttpUrl(place.website),source=safeHttpUrl(place.url);
 const open=place.hoursAssessment?.state;
 const openLabel=open==="likely_open"?"Likely open":open==="likely_closed"?"Likely closed":"Hours unknown";
 return <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#101626]">
  {image&&!imageFailed?<div className="relative h-44 overflow-hidden bg-[#20283a]"><img src={image} alt={"Photo provided for "+place.title} loading="lazy" onError={()=>setImageFailed(true)} className="h-full w-full object-cover"/><span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white">Source photo</span></div>:<div className="h-24 bg-gradient-to-br from-[#242c45] to-[#141b30] flex items-center justify-center gap-2 text-slate-500"><ImageOff size={19}/><span className="text-xs">No verified photo available</span></div>}
  <div className="p-4"><div className="flex justify-between gap-3 items-center text-xs text-violet-300"><span className="flex gap-1 items-center">{place.kind==="event"?<CalendarDays size={14}/>:<MapPin size={14}/>} {place.category}</span>{place.distance!==undefined&&<span className="text-slate-400">{place.distance.toFixed(1)} mi</span>}</div>
  <h3 className="text-lg font-bold mt-2 leading-snug">{place.title}</h3><p className="text-slate-400 text-sm mt-1 line-clamp-2">{place.subtitle}</p>
  {place.kind==="place"?<p className="text-xs mt-2 text-slate-300">{openLabel} <span className="text-slate-500">· Estimated from mapped hours</span></p>:place.start&&<p className="text-sm mt-2 text-slate-300">{eventTime(place.start)}</p>}
  {breakfastMode&&place.kind==="place"&&<p className="text-xs text-amber-200 mt-2">{breakfastDisclosure(breakfastConfidence(place))}</p>}
  <div className="flex flex-wrap gap-x-4 gap-y-3 mt-4 text-sm">{website&&<a href={website} target="_blank" rel="noopener noreferrer" className="text-violet-300 inline-flex gap-1 items-center">Website <ExternalLink size={14}/></a>}{source&&<a href={source} target="_blank" rel="noopener noreferrer" className="text-violet-300 inline-flex gap-1 items-center">{place.kind==="event"?"Event details":"Map listing"} <ExternalLink size={14}/></a>}{place.lat!==undefined&&place.lng!==undefined&&<a href={"https://www.google.com/maps/dir/?api=1&destination="+place.lat+","+place.lng} target="_blank" rel="noopener noreferrer" className="text-violet-300 inline-flex gap-1 items-center"><Navigation size={14}/>Directions</a>}</div>
  <button onClick={()=>setDetails(v=>!v)} aria-expanded={details} className="mt-4 flex items-center gap-1 text-xs text-slate-400 hover:text-white min-h-8">More details <ChevronDown size={14} className={details?"rotate-180":""}/></button>
  {details&&<div className="border-t border-white/10 mt-3 pt-3 space-y-2 text-xs text-slate-400">{place.kind==="place"&&<><p>{place.openingHours?"Listed hours: "+place.openingHours:"Opening hours not listed"}</p><p>{place.hoursAssessment?.reason||"Opening status is not independently verified"}</p></>}{place.lastFetchedAt&&<p>{freshnessDescription(place.lastFetchedAt)}</p>}<p>{sourceDisclosure(place.source)}</p>{image&&<p>Photo supplied by mapped listing; rights and attribution belong to the original source.</p>}</div>}
  </div></article>;
}
