import * as api from '../config';

function get() {
    return api.get("currency");
}

const currencyApi = {
    get
}

export default currencyApi;