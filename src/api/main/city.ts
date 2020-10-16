import * as api from '../config';

function get(filter) {
    return api.get('city', filter);
}

const city = {
    get,
};

export default city;
