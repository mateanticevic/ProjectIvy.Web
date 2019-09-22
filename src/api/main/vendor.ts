import * as api from '../config';

function get(filters) {
    return api.get('vendor', filters);
}

function getPois(vendorId: string) {
    return api.get(`vendor/${vendorId}/poi`);
}

const vendor = {
    get,
    getPois,
};

export default vendor;
