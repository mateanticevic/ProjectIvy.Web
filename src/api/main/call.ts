import * as api from '../config';

export function get(filters) {
    return api.get('call', filters);
}

const call = {
    get,
};

export default call;
