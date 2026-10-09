export type CoverageSummary={
 total:number;places:number;events:number;
 categories:Record<string,number>;
 withListedHours:number;withWebsite:number;
 likelyOpen:number;unknownHours:number;
 warnings:string[];
};
export function summarizeCoverage(places:Array<{category:string;openingHours?:string|null;website?:string|null;hoursAssessment?:{state:string}}>,events:Array<{id:string}>,warnings:string[]):CoverageSummary{
 const categories:Record<string,number>={};
 for(const p of places)categories[p.category||"Other"]=(categories[p.category||"Other"]||0)+1;
 return {total:places.length+events.length,places:places.length,events:events.length,categories,
 withListedHours:places.filter(p=>Boolean(p.openingHours)).length,
 withWebsite:places.filter(p=>Boolean(p.website)).length,
 likelyOpen:places.filter(p=>p.hoursAssessment?.state==="likely_open").length,
 unknownHours:places.filter(p=>!p.hoursAssessment||p.hoursAssessment.state==="unknown").length,
 warnings};
}
