export type DiscoveryDiagnostics={
 requestId:string;
 retrievedAt:string;
 placeCount:number;
 eventCount:number;
 warnings:string[];
 partial:boolean;
};
export function makeDiagnostics(placeCount:number,eventCount:number,warnings:string[],retrievedAt:string):DiscoveryDiagnostics{
 return {requestId:crypto.randomUUID(),retrievedAt,placeCount,eventCount,warnings,partial:warnings.length>0};
}
