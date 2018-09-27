import * as api from '../config';

export function get(filters) {
    return api.get("trip", filters);
}

export function getById(tripId: string) {
    return api.get(`trip/${tripId}`);
}

export function deleteExpense(tripId: string, expenseId: string){
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

export function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}