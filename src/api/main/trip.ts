import * as api from '../config';
import { TripBinding } from 'types/trips';

export function get(filters) {
    return api.get("trip", filters);
}

export function getById(tripId: string) {
    return api.get(`trip/${tripId}`);
}

export function deleteExpense(tripId: string, expenseId: string){
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

export function post(trip: TripBinding) {
    return api.post("trip", trip);
}

export function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}