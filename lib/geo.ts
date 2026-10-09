export type Coordinates={lat:number;lng:number};
export function validCoordinates(c:Coordinates){return Number.isFinite(c.lat)&&Number.isFinite(c.lng)&&Math.abs(c.lat)<=90&&Math.abs(c.lng)<=180}
export function milesBetween(a:Coordinates,b:Coordinates){if(!validCoordinates(a)||!validCoordinates(b))throw Error("Invalid coordinates");const rad=Math.PI/180;const dLat=(b.lat-a.lat)*rad,dLng=(b.lng-a.lng)*rad;const h=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLng/2)**2;return 3958.7613*2*Math.asin(Math.min(1,Math.sqrt(h)))}
export function isWithinRadius(origin:Coordinates,destination:Coordinates,radiusMiles:number){return Number.isFinite(radiusMiles)&&radiusMiles>=0&&milesBetween(origin,destination)<=radiusMiles}
