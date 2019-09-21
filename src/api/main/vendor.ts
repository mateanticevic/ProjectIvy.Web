import * as api from '../config';

function get(filters) {
    return api.get("vendor", filters);
}

function getPois(vendorId: string) {
    return api.get(`vendor/${vendorId}/poi`);
}

const vendorApi = {
    get,
    getPois
}

export default vendorApi;