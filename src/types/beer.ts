export type Beer = {
    abv: number,
    brandId: string,
    id: string,
}

export type Brand = {
    id: string,
    name: string,
}

export type Consumation = {
    date: string,
    beerId: string,
    servingId: string,
    units: number,
    volume: number
}

export type ConsumationFilters = {
    from: string,
    to: string,
    brandId: string,
    servingId: string,
}

export type Serving = {
    id: string,
    name: string,
}
