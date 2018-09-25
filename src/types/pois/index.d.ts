export type PoiCategory = {
    name: string
};

export type Poi = {
    name: string,
    category: PoiCategory,
    address: string,
    id: number
};