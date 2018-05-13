import * as flightApi from '../api/main/flight';
import * as types from '../constants/flightsActionTypes';

export function getFlightCountByAirport() {

    return function (dispatch) {
        return flightApi.getCountByAirport().then(json => { dispatch(getFlightCountByAirportSuccess(json)); });
    };
}

export function getFlightCountByAirportSuccess(data) {
    return { type: types.GET_FLIGHT_COUNT_BY_AIRPORT_SUCCESS, data };
}

export function getFlights() {

    return function (dispatch) {
        return flightApi.getFlights().then(json => { dispatch(getFlightsSuccess(json)); });
    };
}

export function getFlightsSuccess(data) {
    return { type: types.GET_FLIGHTS_SUCCESS, data };
}