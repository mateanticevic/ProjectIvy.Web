import * as api from '../config';

export function get(filters) {
    return api.get("expense", filters);
}

export function put(expense) {
    return api.put("expense", expense);
}