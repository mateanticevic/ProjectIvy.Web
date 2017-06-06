import * as types from '../constants/tripsActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function tripsReducer(state = initialState.trips, action) {

  switch (action.type) {

    case types.CHANGED_FILTERS:
      return objectAssign({}, state, {filters: action.filters});

    case types.CLOSE_MODAL:
      return objectAssign({}, state, {isModalOpen: false});

    case types.GET_TRIPS_SUCCESS:
      return objectAssign({}, state, {trips: action.trips});

    case types.OPEN_MODAL:
      return objectAssign({}, state, {isModalOpen: true});

    default:
      return state;
  }
}
