export interface Geohash {
    id: string,
    dayCount: number,
    firstIn: string,
    lastIn: string,
    totalCount: number,
}

export interface Layer {
    id: string;
}

export interface GeohashItem {
    geohash: Geohash,
}