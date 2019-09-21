import * as api from '../config';

function get() {
    return api.get("expenseType");
}

const expenseTypeApi = {
    get
}

export default expenseTypeApi;
