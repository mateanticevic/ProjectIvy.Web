import * as types from '../constants/tripActionTypes';
import initialState from './initialState';

export default function tripsReducer(s = initialState.trip, action) {

  switch (action.type) {

    case types.GET_TRACKINGS_SUCCESS:
      return {...s, trackings: action.trackings};

    case types.GET_TRIP_SUCCESS:
      return {
        ...s,
        beer: action.data.beer,
        trip: action.data.trip
      };

    default:
      return s;
  }
}
