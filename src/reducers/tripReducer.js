import * as types from '../constants/tripActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function tripsReducer(state = initialState.trip, action) {

  switch (action.type) {

    case types.GET_TRACKINGS_SUCCESS:
      return objectAssign({}, state, {trackings: action.trackings});

    case types.GET_TRIP_SUCCESS:
      return objectAssign({}, state, {trip: action.trip});

    default:
      return state;
  }
}
