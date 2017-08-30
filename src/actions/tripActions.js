import * as types from '../constants/tripActionTypes';
import * as trackingApi from '../api/main/tracking';
import * as tripApi from '../api/main/trip';

export function getTrackings(from, to) {
  return function (dispatch) {
    return trackingApi.get({from, to}).then(json => { dispatch(getTrackingsSuccess(json)); } );
  };
}

export function getTrackingsSuccess(trackings) {
  return {type: types.GET_TRACKINGS_SUCCESS, trackings};
}

export function getTrip(tripId) {
  return function (dispatch) {
    return tripApi.getById(tripId).then(trip => {
        dispatch(getTripSuccess(trip));
        dispatch(getTrackings(trip.timestampStart, trip.timestampEnd));
    } );
  };
}

export function getTripSuccess(trip) {
  return {type: types.GET_TRIP_SUCCESS, trip};
}