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

export interface TripFilters {
    from: string,
    to: string,
    cityId: string[],
    countryId: string[],
    page: number,
    pageSize: number,
}