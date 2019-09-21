import * as api from '../config';

function get() {
    return api.get("card");
}

const cardApi = {
    get
}

export default cardApi;