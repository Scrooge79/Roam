export type CoverageExportRow={city:string;retrievedAt?:string;error?:string;coverage?:{places:number;events:number;withListedHours:number;withWebsite:number;unknownHours:number;warnings:string[]}};
const headers=["City","Checked at","Places","Events","Hours listed","Websites","Unknown hours","Warnings","Error"];
function csvCell(value:unknown){let s=String(value??"");if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
export function coverageCsv(rows:CoverageExportRow[]):string{
 const lines=[headers.map(csvCell).join(",")];
 for(const r of rows){const c=r.coverage;lines.push([r.city,r.retrievedAt??"",c?.places??"",c?.events??"",c?.withListedHours??"",c?.withWebsite??"",c?.unknownHours??"",c?.warnings.join("; ")??"",r.error??""].map(csvCell).join(","))}
 return lines.join("\r\n")+"\r\n";
}
