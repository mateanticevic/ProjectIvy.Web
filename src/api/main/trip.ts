import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type Trip = components['schemas']['Trip'];
type TripBinding = components['schemas']['TripBinding'];
type TripPagedView = components['schemas']['TripPagedView'];
type GetTripQuery = paths['/Trip']['get']['parameters']['query'];

function get(filters?: GetTripQuery): Promise<TripPagedView> {
    return api.get('trip', filters);
}

function getById(tripId: string): Promise<Trip> {
    return api.get(`trip/${tripId}`);
}

const getDaysByYear = () => api.get('trip/days/byyear');

function deleteExpense(tripId: string, expenseId: string): Promise<number> {
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}

const deleteCity = (tripId: string, cityId: string): Promise<number> => api.del(`trip/${tripId}/city/${cityId}`);

function post(trip: TripBinding): Promise<number> {
    return api.post('trip', trip);
}

const postCity = (tripId: string, cityId: string): Promise<number> => api.post(`trip/${tripId}/city/${cityId}`);

const postExpense = (tripId: string, expenseId: string): Promise<number> => api.post(`trip/${tripId}/expense/${expenseId}`);

function postPoi(tripId: string, poiId: string): Promise<number> {
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
