import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ROAM — Find your next experience", description: "Discover events, food, nightlife and things to do nearby." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
