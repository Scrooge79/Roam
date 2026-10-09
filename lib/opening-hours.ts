export type HoursAssessment={state:"likely_open"|"likely_closed"|"unknown";reason:string;timezone:string|null};
const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
function localClock(now:Date,timezone:string){
 const parts=new Intl.DateTimeFormat("en-US",{timeZone:timezone,weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false,hourCycle:"h23"}).formatToParts(now);
 const get=(type:string)=>parts.find(p=>p.type===type)?.value??"";
 const day=DAYS.indexOf(get("weekday").slice(0,2));
 const minute=Number(get("hour"))%24*60+Number(get("minute"));
 return {day,minute};
}
/** Conservative subset of OSM opening_hours. Unsupported expressions return unknown. */
export function assessOpeningHours(hours:string|null|undefined,timezone:string|null|undefined,now=new Date()):HoursAssessment{
 if(!hours?.trim())return {state:"unknown",reason:"Hours not listed",timezone:timezone??null};
 if(!timezone)return {state:"unknown",reason:"Venue timezone unavailable",timezone:null};
 let clock:{day:number;minute:number};
 try{clock=localClock(now,timezone);if(clock.day<0)throw Error("weekday")}catch{return {state:"unknown",reason:"Invalid venue timezone",timezone}};
 const value=hours.trim();
 if(value==="24/7")return {state:"likely_open",reason:"Mapped hours say 24/7; not independently verified",timezone};
 const segments=value.split(";").map(x=>x.trim());
 if(segments.some(x=>!x||/["'()]|\b(PH|SH|sunrise|sunset|week|off|open|unknown)\b/i.test(x)))return {state:"unknown",reason:"Complex hours need confirmation",timezone};
 const entries:{days:number[];start:number;end:number}[]=[];
 for(const segment of segments){
  const match=segment.match(/^(?:(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?(?:,(Mo|Tu|We|Th|Fr|Sa|Su))*)?\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
  if(!match)return {state:"unknown",reason:"Hours format not supported",timezone};
  const tokens=segment.slice(0,segment.indexOf(match[4])).trim();
  let days:number[]=[];
  if(!tokens)days=[0,1,2,3,4,5,6];
  else for(const part of tokens.split(",")){const [a,b]=part.split("-");const first=DAYS.indexOf(a),last=b?DAYS.indexOf(b):first;if(first<0||last<0)return {state:"unknown",reason:"Hours format not supported",timezone};let d=first;while(true){if(!days.includes(d))days.push(d);if(d===last)break;d=(d+1)%7}}
  const parse=(t:string)=>{const [h,m]=t.split(":").map(Number);return h*60+m};
  const start=parse(match[4]),end=parse(match[5]);
  if(start>=1440||end>1440||start===end||!Number.isFinite(start)||!Number.isFinite(end))return {state:"unknown",reason:"Hours format not supported",timezone};
  entries.push({days,start,end});
 }
 const yesterday=(clock.day+6)%7;
 const open=entries.some(x=>x.end>x.start?x.days.includes(clock.day)&&clock.minute>=x.start&&clock.minute<x.end:(x.days.includes(clock.day)&&clock.minute>=x.start)||(x.days.includes(yesterday)&&clock.minute<x.end));
 return {state:open?"likely_open":"likely_closed",reason:"Estimated from community-mapped hours; call to confirm",timezone};
}
