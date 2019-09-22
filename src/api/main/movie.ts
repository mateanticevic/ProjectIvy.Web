import * as api from '../config';

function get(filters) {
    return api.get("movie", filters);
}

const movie = {
    get
}

export default movie;
