import * as api from '../config';

function get() {
    return api.get('currency');
}

const currency = {
    get,
};

export default currency;
