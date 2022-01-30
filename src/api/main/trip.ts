import { TripBinding } from 'types/trips';
import * as api from '../config';

function get(filters) {
    return api.get('trip', filters);
}

function getById(tripId: string) {
    return api.get(`trip/${tripId}`);
}

const getDaysByYear = () => api.get('trip/days/byyear');

function deleteExpense(tripId: string, expenseId: string) {
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

function post(trip: TripBinding) {
    return api.post('trip', trip);
}

const postExpense = (tripId: string, expenseId: string) => api.post(`trip/${tripId}/expense/${expenseId}`);

function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}

const trip = {
    deleteExpense,
    get,
    getById,
    getDaysByYear,
    post,
    postExpense,
    postPoi,
};

export default trip;
