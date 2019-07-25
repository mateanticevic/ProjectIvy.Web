import * as api from '../config';

export function get(filters) {
    return api.get("vendor", filters);
}

export function getPois(vendorId: string) {
    return api.get(`vendor/${vendorId}/poi`);
}