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

export function breakfastScore(place:PlaceForIntent & {distance?:number;hoursAssessment?:{state:string}}):number{
 const confidence=breakfastConfidence(place);
 const evidence={explicit:90,likely:65,possible:35,unlikely:0}[confidence];
 const distanceBonus=place.distance===undefined?0:Math.max(0,15-Math.min(15,place.distance*3));
 const hoursBonus=place.hoursAssessment?.state==="likely_open"?5:0;
 return evidence+distanceBonus+hoursBonus;
}
