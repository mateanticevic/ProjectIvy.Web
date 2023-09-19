import * as api from '../config';
import { components } from 'types/ivy-types';

type TripBinding = components['schemas']['TripBinding'];

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

const deleteCity = (tripId: string, cityId: string) => api.del(`trip/${tripId}/city/${cityId}`);

function post(trip: TripBinding) {
    return api.post('trip', trip);
}

const postCity = (tripId: string, cityId: string) => api.post(`trip/${tripId}/city/${cityId}`);

const postExpense = (tripId: string, expenseId: string) => api.post(`trip/${tripId}/expense/${expenseId}`);

function postPoi(tripId: string, poiId: string) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}

const trip = {
    deleteExpense,
    deleteCity,
    get,
    getById,
    getDaysByYear,
    post,
    postCity,
    postExpense,
    postPoi,
};

export default trip;
