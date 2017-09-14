import * as api from '../config';

export function get(filters) {
    return api.get("poi", filters);
}

export function post(poi) {
    return api.post(`poi/${poi.name.replace(/ /g, "-").toLowerCase()}`, poi);
}