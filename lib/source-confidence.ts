export type FreshnessLabel="recently_retrieved"|"older_retrieval"|"unknown";
export function retrievalFreshness(timestamp:string|null|undefined,now=new Date()):FreshnessLabel{
 if(!timestamp)return "unknown";const parsed=Date.parse(timestamp);if(!Number.isFinite(parsed)||parsed>now.getTime()+60000)return "unknown";
 const ageHours=(now.getTime()-parsed)/3600000;
 return ageHours<=24?"recently_retrieved":"older_retrieval";
}
export function freshnessDescription(timestamp:string|null|undefined,now=new Date()){
 const state=retrievalFreshness(timestamp,now);
 if(state==="unknown")return "Retrieval time unavailable";
 const hours=Math.max(0,Math.floor((now.getTime()-Date.parse(timestamp!))/3600000));
 return hours<1?"Retrieved less than an hour ago":hours<24?`Retrieved ${hours}h ago`:`Retrieved ${Math.floor(hours/24)}d ago`;
}
export function sourceDisclosure(source:string){return source==="OpenStreetMap"?"Community-maintained map listing. Hours and venue status may be outdated.":source==="Ticketmaster"?"Event details provided by Ticketmaster; confirm with organizer.":"Third-party listing; verify before visiting."}
