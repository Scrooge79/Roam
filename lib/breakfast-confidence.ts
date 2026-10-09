import type {PlaceForIntent} from "./discovery-intents";
export type BreakfastConfidence="explicit"|"likely"|"possible"|"unlikely";
export function breakfastConfidence(place:PlaceForIntent):BreakfastConfidence{
 if(place.category!=="Food & Drink")return "unlikely";
 if(place.breakfast==="yes")return "explicit";
 const text=[place.title,place.cuisine??""].join(" ").toLowerCase().replace(/[_-]/g," ");
 if(/\b(breakfast|brunch|pancake|waffle|bagel|diner)\b/.test(text))return "likely";
 if(/\b(bakery|bakehouse|coffee|cafe|café|pastry|donut|doughnut)\b/.test(text))return "possible";
 return "unlikely";
}
export function breakfastDisclosure(confidence:BreakfastConfidence):string{
 switch(confidence){
  case "explicit":return "Breakfast is indicated in mapped venue data; confirm service times.";
  case "likely":return "Likely breakfast-focused based on the listing; menu not verified.";
  case "possible":return "Potential morning stop; breakfast menu not verified.";
  default:return "Breakfast service not established.";
 }
}
