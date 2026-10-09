export type DiscoveryCategory="Breakfast"|"Drinks"|"Games"|"Restaurants"|"Museums";
export type PlaceForIntent={title:string;category:string;cuisine?:string|null;breakfast?:string|null};
const normalize=(value:string)=>value.toLowerCase().replace(/[_-]/g," ");
export function matchesIntent(place:PlaceForIntent,intent:DiscoveryCategory):boolean{
 const text=normalize([place.title,place.cuisine??""].join(" "));
 if(intent==="Breakfast")return place.category==="Food & Drink"&&(place.breakfast==="yes"||/\b(breakfast|brunch|bagel|pancake|waffle|diner|bakery|bakehouse|coffee|cafe|café)\b/.test(text));
 if(intent==="Drinks")return place.category==="Nightlife"||/\b(cocktail|bar|pub|lounge|brewery)\b/.test(text);
 if(intent==="Games")return place.category==="Activities"&&/\b(arcade|bowling|escape|game|mini golf|miniature golf)\b/.test(text);
 if(intent==="Restaurants")return place.category==="Food & Drink";
 return place.category==="Attractions"&&/\b(museum|gallery)\b/.test(text);
}
