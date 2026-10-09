"use client";
import {MapPin,Navigation,Info} from "lucide-react";
type Marker={id:string;name:string;lat:number;lng:number;category:string};
export default function MapPreview({markers,center}:{markers:Marker[];center:{lat:number;lng:number}}){
 const valid=markers.filter(m=>Number.isFinite(m.lat)&&Number.isFinite(m.lng));
 return <section aria-label="Map preview" className="glass rounded-2xl overflow-hidden"><div className="relative min-h-72 bg-[#17243a] flex items-center justify-center"><div className="absolute inset-0 opacity-30" style={{backgroundImage:"linear-gradient(25deg,transparent 48%,#5c6a87 49%,#5c6a87 51%,transparent 52%),linear-gradient(110deg,transparent 48%,#5c6a87 49%,#5c6a87 51%,transparent 52%)",backgroundSize:"100px 85px"}}/><div className="relative text-center px-5"><MapPin size={34} className="mx-auto mb-3 text-violet-400"/><h3 className="text-lg font-bold">Map explorer</h3><p className="text-slate-300 text-sm mt-2 max-w-md">Map tiles and verified place markers will appear when a map provider is connected. We never place invented pins on a map.</p><p className="text-slate-400 text-xs mt-3">{valid.length} verified coordinates available · Center {center.lat.toFixed(2)}, {center.lng.toFixed(2)}</p></div></div><div className="p-4 flex items-center gap-2 text-xs text-slate-400"><Info size={15}/> Map preview only — not a navigable map yet.</div></section>
}
