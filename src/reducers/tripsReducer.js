import * as types from '../constants/tripsActionTypes';
import initialState from './initialState';

export default function tripsReducer(state = initialState.trips, action) {

  switch (action.type) {

    case types.CHANGED_FILTERS:
      return {...state, filters: action.filters};

    case types.CLOSE_MODAL:
      return {...state, isModalOpen: false};

    case types.GET_COUNTRIES_VISITED_BOUNDARIES_SUCCESS:
      return {...state, countries: action.countries};

    case types.GET_TRIPS_SUCCESS:
      return {...state, trips: action.trips};

    case types.OPEN_MODAL:
      return {...state, isModalOpen: true};

    default:
      return state;
  }
}
