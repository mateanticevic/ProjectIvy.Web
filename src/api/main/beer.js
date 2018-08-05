import * as api from '../config';

export function get(filters) {
    return api.get("beer", filters);
}

export function getBrands() {
    return api.get("beer/brand");
}