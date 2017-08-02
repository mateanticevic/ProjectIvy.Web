import * as api from '../config';

export function get(filters) {
    return api.get("expense", filters);
}

export function post(expense) {
    return api.post("expense", expense);
}