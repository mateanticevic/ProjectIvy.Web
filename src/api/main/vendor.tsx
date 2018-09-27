import * as api from '../config';

export function get() {
    return api.get("vendor?pageAll=true");
}

export function getPois(vendorId: string) {
    return api.get(`vendor/${vendorId}/poi`);
}