import * as api from '../config';

function get() {
    return api.get('card');
}

const card = {
    get,
};

export default card;
