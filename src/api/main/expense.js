import * as api from '../config';

export function get(filters) {
    return api.get("expense", filters);
}

export function getSum(filters) {
    return api.get("expense/sum", filters);
}

export function post(expense) {
    return api.post("expense", expense);
}

export function put(expense) {
    return api.put(`expense/${expense.id}`, expense);
}

export function postFile(expenseId, fileId, payload) {
    return api.post(`expense/${expenseId}/file/${fileId}`, payload);
}