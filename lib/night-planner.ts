export type PlanCandidate={id:string;title:string;category:string;kind:"place"|"event";start?:string|null;distance?:number;url?:string|null};
export type PlanPreferences={hours:number;vibe:"balanced"|"food"|"activities"|"nightlife";startAt:string};
export type PlanStop={item:PlanCandidate;time:string;durationMinutes:number};
const minutes:Record<string,number>={"Food & Drink":75,"Activities":75,"Attractions":60,"Nightlife":75,"Events":120};
const preference:Record<PlanPreferences["vibe"],string[]>={balanced:["Food & Drink","Activities","Nightlife","Attractions","Events"],food:["Food & Drink","Attractions","Nightlife","Activities","Events"],activities:["Activities","Attractions","Food & Drink","Nightlife","Events"],nightlife:["Nightlife","Food & Drink","Activities","Events","Attractions"]};
export function buildSuggestedPlan(items:PlanCandidate[],p:PlanPreferences):PlanStop[]{
 const start=new Date(p.startAt);if(!Number.isFinite(start.getTime())||!Number.isFinite(p.hours)||p.hours<1||p.hours>12)return [];
 const maxMinutes=p.hours*60;let elapsed=0;const result:PlanStop[]=[];const used=new Set<string>();
 const ordered=[...items].filter(x=>x.kind==="place"&&(!Number.isFinite(x.distance)||x.distance!<=15)).sort((a,b)=>preference[p.vibe].indexOf(a.category)-preference[p.vibe].indexOf(b.category)||(a.distance??99)-(b.distance??99));
 for(const item of ordered){if(used.has(item.id)||result.length>=4)continue;const duration=minutes[item.category]??60;const transit=result.length?20:0;if(elapsed+transit+duration>maxMinutes)continue;elapsed+=transit;result.push({item,time:new Date(start.getTime()+elapsed*60000).toISOString(),durationMinutes:duration});elapsed+=duration;used.add(item.id)}
 return result;
}
