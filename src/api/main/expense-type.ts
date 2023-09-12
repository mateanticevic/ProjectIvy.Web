import * as api from '../config';

function get(filters) {
    return api.get('expenseType', filters);
}

const expenseType = {
    get,
};

export default expenseType;
