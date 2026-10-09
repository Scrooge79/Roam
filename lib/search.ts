import type {Listing,Category} from "./discovery";
export type SearchOptions={query?:string;category?:Category;maxPrice?:number};
export function searchListings(listings:Listing[],options:SearchOptions){const q=(options.query||"").trim().toLocaleLowerCase();return listings.filter(x=>(!options.category||options.category==="All"||x.category===options.category)&&(!q||[x.name,x.description,x.neighborhood,x.category,...x.tags].join(" ").toLocaleLowerCase().includes(q)));}
export type VerifiedEvent={id:string;title:string;startsAt:string;endsAt:string|null;timezone:string;latitude:number;longitude:number;sourceUrl:string;lastVerifiedAt:string;status:"scheduled"|"cancelled"|"postponed";};
export function isHappeningAt(event:VerifiedEvent,now:Date){const start=Date.parse(event.startsAt),end=event.endsAt?Date.parse(event.endsAt):NaN;return event.status==="scheduled"&&Number.isFinite(start)&&Number.isFinite(end)&&start<=now.getTime()&&now.getTime()<end;}
