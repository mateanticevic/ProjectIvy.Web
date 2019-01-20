import * as types from '../constants/tripActionTypes';
import initialState from './initialState';

export default function tripsReducer(state = initialState.trip, action) {

  switch (action.type) {

    case types.GET_TRACKINGS_SUCCESS:
      return {...state, trackings: action.trackings};

    case types.GET_TRIP_SUCCESS:
      return {
        ...state,
        beer: action.data.beer,
        trip: action.data.trip
      };

    default:
      return state;
  }
}
