import * as api from '../config';

import { components } from 'types/ivy-types';

type FlightBinding = components['schemas']['FlightBinding'];

const get = (filters) => api.get('flight', filters);

const getCountByAirline = (filters) => api.get('flight/count/byairline', filters);

const getCountByAirport = (filters) => api.get('flight/count/byairport', filters);

const post = (flight: FlightBinding) => api.post('flight', flight);

const put = (id: string, flight: FlightBinding) => api.put(`flight/${id}`, flight);

const flight = {
    get,
    getCountByAirline,
    getCountByAirport,
    post,
    put,
};

export default flight;
