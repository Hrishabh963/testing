export interface AmlHit {
    hitNo: number;
    searchName: string;
    entity: string;
    alias: string;
    country: string | null;
    amlType: "pep" | "sanctions" | "warnings";
    listingOrAdverseMedia: Record<string, any>[];
    action: "Verify" | "Verified";
}


export interface AML {
    type: string,
    name: string,
    yearOfBirth: number | string,
    matchStatus?: "NO MATCH" | "POTENTIAL MATCH"| "EXACT MATCH",
    noOfHits?: number,
    amlHits: Array<AmlHit>,
    initiateAml: boolean, 
    status: "Completed" | "Failed",
    error?: string
}