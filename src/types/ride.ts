export interface RideBinding {
    typeId: string;
    destinationCityId: string;
    destinationPoiId: string;
    originCityId: string;
    originPoiId: string;
    arrival: string;
    departure: string;
}

export interface Ride {
    arrival: Date;
    departure: Date;
}