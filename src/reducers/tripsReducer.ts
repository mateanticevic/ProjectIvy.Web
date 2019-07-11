import * as types from '../constants/tripsActionTypes';
import initialState from './initialState';

export default function tripsReducer(s = initialState.trips, action) {

  switch (action.type) {

    case types.CHANGED_FILTERS:
      return {...s, filters: action.filters};

    case types.CLOSE_MODAL:
      return {...s, isModalOpen: false};

    case types.GET_COUNTRIES_VISITED_BOUNDARIES_SUCCESS:
      return {...s, countries: action.countries};

    case types.GET_TRIPS_SUCCESS:
      return {...s, trips: action.trips};

    case types.OPEN_MODAL:
      return {...s, isModalOpen: true};

    default:
      return s;
  }
}
