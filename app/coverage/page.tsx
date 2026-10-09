"use client";
import {coverageCsv} from "../../lib/coverage-export";
import {useState} from "react";
import Link from "next/link";
type Coverage={total:number;places:number;events:number;categories:Record<string,number>;withListedHours:number;withWebsite:number;likelyOpen:number;unknownHours:number;warnings:string[]};
type CityRow={city:string;coverage?:Coverage;retrievedAt?:string;error?:string};
const STARTER=["Durham, NC","Pittsburgh, PA","Miami, FL","Charlotte, NC","Raleigh, NC"];
export default function CoverageDashboard(){
 const [cities,setCities]=useState(STARTER.join("\n")),[rows,setRows]=useState<CityRow[]>([]),[busy,setBusy]=useState(false),[progress,setProgress]=useState("");
 async function run(){
  const names=[...new Set(cities.split(/\n/).map(s=>s.trim()).filter(Boolean))].slice(0,8);
  setRows([]);setBusy(true);
  const next:CityRow[]=[];
  try{
   for(let i=0;i<names.length;i++){
    const city=names[i];setProgress("Checking "+city+" ("+(i+1)+"/"+names.length+")");
    try{
     const g=await fetch("/api/geocode?q="+encodeURIComponent(city));if(!g.ok)throw Error("Geocoding unavailable");
     const location=await g.json();const point=location.results?.[0];if(!point)throw Error("City not found");
     const u=await fetch("/api/unified?lat="+encodeURIComponent(point.lat)+"&lng="+encodeURIComponent(point.lng)+"&radius=1800");
     if(!u.ok)throw Error("Discovery request failed");
     const result=await u.json();next.push({city,coverage:result.coverage,retrievedAt:result.retrievedAt});
    }catch(e){next.push({city,error:e instanceof Error?e.message:"Unavailable"})}
    setRows([...next]);
   }
  }finally{setBusy(false);setProgress("")}
 }
 const total=rows.reduce((sum,row)=>sum+(row.coverage?.total??0),0);
 function exportCsv(){if(!rows.length)return;const blob=new Blob([coverageCsv(rows)],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="roam-coverage-"+new Date().toISOString().slice(0,10)+".csv";a.click();URL.revokeObjectURL(url)}
 return <main className="gradient min-h-screen px-5 py-8"><div className="max-w-6xl mx-auto"><header className="flex items-center justify-between gap-3"><Link href="/" className="font-black text-2xl">roam<span className="text-violet-400">.</span></Link><Link href="/" className="text-violet-300 text-sm">Back to discovery</Link></header><div className="mt-12"><div className="text-violet-300 text-xs font-bold tracking-widest">OPERATIONS PREVIEW</div><h1 className="text-4xl md:text-5xl font-black mt-3">City coverage dashboard</h1><p className="text-slate-400 mt-4 max-w-3xl">Compare how much information our providers return across cities. Counts represent a small central search area, not total city inventory. No historical tracking or database is connected yet.</p></div><div className="glass rounded-2xl p-5 mt-8"><label className="block text-sm font-bold mb-2" htmlFor="cities">Cities to compare (up to 8)</label><textarea id="cities" value={cities} onChange={e=>setCities(e.target.value)} rows={5} className="w-full rounded-xl bg-[#101626] border border-white/10 p-4 outline-none" placeholder="City, State — one per line"/><button disabled={busy} onClick={run} className="mt-4 rounded-xl bg-violet-400 text-slate-950 px-5 py-3 font-bold disabled:opacity-50">{busy?"Checking cities…":"Run coverage comparison"}</button><p role="status" className="text-sm text-slate-400 mt-3">{progress||"Requests are sequential to reduce load on public data providers. Use sparingly."}</p></div>{rows.length>0&&<><div className="mt-5 flex justify-end"><button onClick={exportCsv} className="pill text-sm">Export coverage CSV</button></div><div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-7">{[["Cities checked",rows.length],["Results returned",total],["Cities with errors",rows.filter(x=>x.error).length]].map(([label,value])=><div className="glass rounded-xl p-4" key={String(label)}><div className="text-2xl font-bold">{value}</div><div className="text-sm text-slate-400 mt-1">{label}</div></div>)}</div><div className="mt-7 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-[#171d2d]"><tr>{["City","Places","Events","Hours listed","Websites","Unknown hours","Provider warnings"].map(x=><th key={x} className="px-4 py-3 whitespace-nowrap">{x}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.city} className="border-t border-white/10"><td className="px-4 py-4 font-bold whitespace-nowrap">{r.city}{r.error&&<div className="text-rose-300 text-xs font-normal">{r.error}</div>}</td>{r.coverage?<><td className="px-4">{r.coverage.places}</td><td className="px-4">{r.coverage.events}</td><td className="px-4">{r.coverage.withListedHours}</td><td className="px-4">{r.coverage.withWebsite}</td><td className="px-4">{r.coverage.unknownHours}</td><td className="px-4 text-amber-200">{r.coverage.warnings.join("; ")||"None reported"}</td></>:<td colSpan={6} className="px-4 text-slate-400">Unavailable</td>}</tr>)}</tbody></table></div><p className="text-xs text-slate-400 mt-4">Results reflect the selected coordinates and approximately 1.1-mile radius. No business status is independently verified. © OpenStreetMap contributors.</p></>}</div></main>;
}
