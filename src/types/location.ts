export interface Geohash {
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