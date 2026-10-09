/** Render OSM opening_hours in readable 12-hour time, without guessing unsupported rules. */
const DAYS:Record<string,string>={Mo:"Mon",Tu:"Tue",We:"Wed",Th:"Thu",Fr:"Fri",Sa:"Sat",Su:"Sun"};
export function formatClock(value:string):string{
 const match=/^(\d{1,2}):(\d{2})$/.exec(value);
 if(!match)return value;
 const h=Number(match[1]),m=Number(match[2]);
 if(h>24||m>59||(h===24&&m!==0))return value;
 if(h===24)return "12:00 AM (next day)";
 return String(h%12||12)+":"+match[2]+" "+(h<12?"AM":"PM");
}
export function formatMappedHours(raw:string|null|undefined):string|null{
 if(!raw?.trim())return null;
 if(raw.trim()==="24/7")return "Open 24 hours, every day (mapped)";
 const value=raw.trim();
 if(value.length>200)return null;
 // Unknown expressions are shown only in details, never transformed into a confident schedule.
 if(/[{}"'()]|\b(PH|SH|sunrise|sunset|week|off|open|unknown)\b/i.test(value))return null;
 const parts=value.split(";").map(x=>x.trim());
 const output:string[]=[];
 for(const part of parts){
  const match=/^(?:(?<days>(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:,(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su)))*)\s+)?(?<times>\d{1,2}:\d{2}-\d{1,2}:\d{2}(?:,\d{1,2}:\d{2}-\d{1,2}:\d{2})*)$/.exec(part);
  if(!match?.groups)return null;
  const days=(match.groups.days||"Daily").replace(/Mo|Tu|We|Th|Fr|Sa|Su/g,d=>DAYS[d]);
  const times=match.groups.times.split(",").map(t=>{const [a,b]=t.split("-");return formatClock(a)+" – "+formatClock(b)}).join(", ");
  output.push(days+": "+times);
 }
 return output.join(" · ");
}
