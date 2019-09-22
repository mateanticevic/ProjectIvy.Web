import * as api from '../config';

function getCountByAirport(filters) {
    return api.get(`flight/count/byairport`, filters);
}

function getFlights(filters) {
    return api.get(`flight`, filters);
}

const flight = {
    getCountByAirport,
    getFlights,
};

export default flight;
