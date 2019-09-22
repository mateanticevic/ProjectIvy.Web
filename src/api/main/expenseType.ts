import * as api from '../config';

function get() {
    return api.get('expenseType');
}

const expenseType = {
    get,
};

export default expenseType;
