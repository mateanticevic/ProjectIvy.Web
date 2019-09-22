import { TripBinding } from 'types/trips';
import * as api from '../config';

function get(filters) {
    return api.get('trip', filters);
}

function getById(tripId: string) {
    return api.get(`trip/${tripId}`);
}

function deleteExpense(tripId: string, expenseId: string) {
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

function post(trip: TripBinding) {
    return api.post('trip', trip);
}

function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}

const trip = {
    deleteExpense,
    get,
    getById,
    post,
    postPoi,
};

export default trip;
