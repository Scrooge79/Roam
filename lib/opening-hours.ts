export type HoursAssessment={state:"likely_open"|"likely_closed"|"unknown";reason:string;timezone:string|null};
const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
function localClock(now:Date,timezone:string){
 const parts=new Intl.DateTimeFormat("en-US",{timeZone:timezone,weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false,hourCycle:"h23"}).formatToParts(now);
 const get=(type:string)=>parts.find(p=>p.type===type)?.value??"";
 return {day:DAYS.indexOf(get("weekday").slice(0,2)),minute:Number(get("hour"))%24*60+Number(get("minute"))};
}
function parseDays(s:string):number[]|null{
 if(!s)return [0,1,2,3,4,5,6];
 const days=new Set<number>();
 for(const part of s.split(",")){
  const [a,b]=part.split("-"),first=DAYS.indexOf(a),last=b?DAYS.indexOf(b):first;
  if(first<0||last<0)return null;
  let day=first;for(let i=0;i<7;i++){days.add(day);if(day===last)break;day=(day+1)%7}
 }
 return [...days];
}
function minutes(s:string){const [h,m]=s.split(":").map(Number);return h*60+m}
export function assessOpeningHours(hours:string|null|undefined,timezone:string|null|undefined,now=new Date()):HoursAssessment{
 if(!hours?.trim())return {state:"unknown",reason:"Hours not listed",timezone:timezone??null};
 if(!timezone)return {state:"unknown",reason:"Venue timezone unavailable",timezone:null};
 let clock:{day:number;minute:number};try{clock=localClock(now,timezone);if(clock.day<0||!Number.isFinite(clock.minute))throw Error("clock")}catch{return {state:"unknown",reason:"Invalid venue timezone",timezone}};
 const raw=hours.trim();
 if(raw==="24/7")return {state:"likely_open",reason:"Mapped hours say 24/7; not independently verified",timezone};
 // Holiday overrides and complex expressions must not be guessed.
 if(/\b(PH|SH|sunrise|sunset|week|off|open|unknown)\b|["'(){}+]/i.test(raw))return {state:"unknown",reason:"Exceptions or complex hours need confirmation",timezone};
 const rules:{days:number[];start:number;end:number}[]=[];
 for(const segment of raw.split(";").map(x=>x.trim())){
  const m=segment.match(/^(?:(?<days>(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:,(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su)))*)\s+)?(?<times>\d{1,2}:\d{2}-\d{1,2}:\d{2}(?:,\d{1,2}:\d{2}-\d{1,2}:\d{2})*)$/);
  if(!m?.groups)return {state:"unknown",reason:"Hours format not supported",timezone};
  const days=parseDays(m.groups.days??"");if(!days)return {state:"unknown",reason:"Hours format not supported",timezone};
  for(const period of m.groups.times.split(",")){const [a,b]=period.split("-"),start=minutes(a),end=minutes(b);if(!Number.isFinite(start)||!Number.isFinite(end)||start>=1440||end>1440||start===end)return {state:"unknown",reason:"Hours format not supported",timezone};rules.push({days,start,end})}
 }
 if(!rules.length)return {state:"unknown",reason:"Hours format not supported",timezone};
 const yesterday=(clock.day+6)%7;
 const open=rules.some(r=>r.end>r.start?r.days.includes(clock.day)&&clock.minute>=r.start&&clock.minute<r.end:(r.days.includes(clock.day)&&clock.minute>=r.start)||(r.days.includes(yesterday)&&clock.minute<r.end));
 return {state:open?"likely_open":"likely_closed",reason:"Estimated from community-mapped hours; confirm with venue",timezone};
}
