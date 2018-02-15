import * as api from '../config';

export function get(filters) {
    return api.get("trip", filters);
}

export function getById(tripId) {
    return api.get(`trip/${tripId}`);
}

export function deleteExpense(tripId, expenseId){
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

export function postPoi(tripId, poiId) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}