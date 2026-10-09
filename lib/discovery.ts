export type Category = "All" | "Events" | "Food & Drink" | "Activities" | "Nightlife" | "Outdoors";
export type Listing = {id:string;name:string;category:Exclude<Category,"All">;description:string;neighborhood:string;emoji:string;price:string;tags:string[];image:string;url:string};
// Demonstration content only. Do not represent these entries as verified live availability.
export const demoListings:Listing[]=[
{id:"arcade",name:"Arcade night",category:"Activities",description:"Challenge friends to pinball, retro games and air hockey.",neighborhood:"Downtown",emoji:"🕹️",price:"$",tags:["Games","Friends"],image:"linear-gradient(135deg,#4930a5,#17132e)",url:""},
{id:"cocktails",name:"Rooftop cocktails",category:"Nightlife",description:"Sip something creative with skyline views.",neighborhood:"City center",emoji:"🍸",price:"$$",tags:["Cocktails","Date night"],image:"linear-gradient(135deg,#aa4b7a,#2a1638)",url:""},
{id:"music",name:"Live music",category:"Events",description:"Discover a new artist and a memorable night.",neighborhood:"Near you",emoji:"🎵",price:"$$",tags:["Music","Tonight"],image:"linear-gradient(135deg,#d26434,#301a39)",url:""},
{id:"dinner",name:"Dinner out",category:"Food & Drink",description:"Find a table and try something delicious.",neighborhood:"Downtown",emoji:"🍝",price:"$$",tags:["Food","Date night"],image:"linear-gradient(135deg,#815e3c,#262134)",url:""},
{id:"escape",name:"Escape room",category:"Activities",description:"Solve puzzles and beat the clock as a team.",neighborhood:"Near you",emoji:"🔐",price:"$$",tags:["Adventure","Groups"],image:"linear-gradient(135deg,#267b86,#152039)",url:""},
{id:"hike",name:"Explore outdoors",category:"Outdoors",description:"Get outside and discover scenic trails.",neighborhood:"Around town",emoji:"🌲",price:"Free",tags:["Nature","Daytime"],image:"linear-gradient(135deg,#276f59,#102c35)",url:""}];
