export type PriceLevel="Free"|"$"|"$$"|"$$$";
export type DiscoveryFilter={query:string;categories:string[];priceLevels:PriceLevel[];radiusMiles:number};
export function matchesFilters(item:{name:string;description?:string;category:string;price?:string;tags?:string[]},f:DiscoveryFilter){
 const q=f.query.trim().toLocaleLowerCase();
 return (!q||[item.name,item.description??"",item.category,...(item.tags??[])].join(" ").toLocaleLowerCase().includes(q))
 &&(f.categories.length===0||f.categories.includes(item.category))
 &&(f.priceLevels.length===0||f.priceLevels.includes(item.price as PriceLevel));
}
export function safeRadius(value:number){return Number.isFinite(value)?Math.max(1,Math.min(100,value)):25}
