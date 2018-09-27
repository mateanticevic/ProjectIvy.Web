export type PoiCategory = {
    id: string,
    name: string
}

export type Poi = {
    name: string,
    category: PoiCategory,
    address: string,
    latitude: number,
    longitude: number,
    poiCategoryId: string,
    id: string
};