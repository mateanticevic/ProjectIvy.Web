import * as api from '../config';

export function get(filters) {
    return api.get("beer", filters);
}

export function getBrands() {
    return api.get("beer/brand");
}

export function postBrand(name) {
    return api.post("beer/brand", name);
}

export function postBeer(brandId, beer) {
    return api.post(`beer/brand/${brandId}/beer`, beer);
}