import * as api from '../config';

export function get(filters) {
    return api.get("expenseType", filters);
}