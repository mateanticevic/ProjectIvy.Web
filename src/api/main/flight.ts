import * as api from '../config';

import { components } from 'types/ivy-types';

type FlightBinding = components['schemas']['FlightBinding'];

function getCountByAirport(filters) {
    return api.get('flight/count/byairport', filters);
}

function get(filters) {
    return api.get('flight', filters);
}

const post = (flight: FlightBinding) => api.post('flight', flight);

const flight = {
    getCountByAirport,
    get,
    post,
};

export default flight;
