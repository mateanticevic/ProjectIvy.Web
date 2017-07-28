import * as api from '../config';

export function get() {
    return api.get("vendor");
}

export function getPois(vendorId) {
    return api.get(`vendor/${vendorId}/poi`);
}