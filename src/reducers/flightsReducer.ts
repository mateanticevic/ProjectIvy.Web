import * as types from '../constants/flightsActionTypes';

import initialState from './initialState';

export default function flightsReducer(s = initialState.flights, action) {

    switch (action.type) {

        case types.GET_FLIGHT_COUNT_BY_AIRPORT_SUCCESS:
            return { ...s, countByAirport: action.data };

        case types.GET_FLIGHTS_SUCCESS:
            return { ...s, flights: action.data };

        case types.FLIGHTS_FILTERS_CHANGED:
            return { ...s, filters: action.data };

        default:
            return s;
    }
}