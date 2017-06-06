import * as types from '../constants/tripsActionTypes';
import * as tripApi from '../api/main/trip';

export function changedFilters(filters) {
  return function (dispatch) {
    dispatch(getTrips(filters));
    return dispatch({type: types.CHANGED_FILTERS, filters});
  };
}

export function closeModal() {
  return {type: types.CLOSE_MODAL};
}

export function getTrips(filters) {
  return function (dispatch) {
    return tripApi.get(filters).then(json => { dispatch(getTripsSuccess(json)); } );
  };
}

export function getTripsSuccess(trips) {
  return {type: types.GET_TRIPS_SUCCESS, trips};
}

export function openModal() {
  return {type: types.OPEN_MODAL};
}