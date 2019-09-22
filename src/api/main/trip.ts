import * as api from '../config';
import { TripBinding } from 'types/trips';

function get(filters) {
    return api.get("trip", filters);
}

function getById(tripId: string) {
    return api.get(`trip/${tripId}`);
}

function deleteExpense(tripId: string, expenseId: string){
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

function post(trip: TripBinding) {
    return api.post("trip", trip);
}

function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}

const trip = {
    get,
    getById,
    deleteExpense,
    post,
    postPoi
}

export default trip;
