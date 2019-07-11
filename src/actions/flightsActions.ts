import * as flightApi from '../api/main/flight';
import * as types from '../constants/flightsActionTypes';

export function getFlightCountByAirport(filters) {

    return function (dispatch) {
        return flightApi.getCountByAirport(filters).then(json => { dispatch(getFlightCountByAirportSuccess(json)); });
    };
}

export function getFlightCountByAirportSuccess(data) {
    return { type: types.GET_FLIGHT_COUNT_BY_AIRPORT_SUCCESS, data };
}

export function getFlights(filters) {

    return function (dispatch) {
        return flightApi.getFlights(filters).then(json => { dispatch(getFlightsSuccess(json)); });
    };
}

export function getFlightsSuccess(data) {
    return { type: types.GET_FLIGHTS_SUCCESS, data };
}

export function filterChanged(filters) {
    return dispatch => {
        dispatch(getFlights(filters));
        dispatch(getFlightCountByAirport(filters));
        return { type: types.FLIGHTS_FILTERS_CHANGED, data: filters };
    };
}