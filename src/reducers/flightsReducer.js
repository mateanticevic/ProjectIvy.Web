import * as types from '../constants/flightsActionTypes';

import initialState from './initialState';

export default function flightsReducer(state = initialState.flights, action) {

    switch (action.type) {

        case types.GET_FLIGHT_COUNT_BY_AIRPORT_SUCCESS:
            return { ...state, countByAirport: action.data };

        case types.GET_FLIGHTS_SUCCESS:
            return { ...state, flights: action.data };

        default:
            return state;
    }
}