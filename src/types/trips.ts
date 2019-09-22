export interface Trip {
    id: string;
    name: string;
    timestampEnd: Date;
    timestampStart: Date;
    distance: number;
    countries: any[];
    cities: any[];
    expenses: any[];
    pois?: any;
    totalSpent: number;
}

export interface TripBinding {
    name: string;
    cityIds: string[];
    timestampEnd: Date;
    timestampStart: Date;
}
