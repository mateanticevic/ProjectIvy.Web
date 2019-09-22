import * as api from '../config';

function get(filters) {
    return api.get("poi", filters);
}

function post(poi) {
    return api.post("poi", poi);
}

const poi = {
    get,
    post
}

export default poi;

