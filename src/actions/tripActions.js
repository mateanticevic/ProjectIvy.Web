import * as types from '../constants/tripActionTypes';
import * as consumationApi from '../api/main/consumation';
import * as trackingApi from '../api/main/tracking';
import * as tripApi from '../api/main/trip';
import { toastr } from 'react-redux-toastr';

export function deleteExpense(tripId, expenseId) {
  return function () {
    return tripApi.deleteExpense(tripId, expenseId).then(() => {
      toastr.success('Success', `Expense #${expenseId} unlinked from trip.`);
    });
  };
}

export function getTrackings(from, to) {
  return function (dispatch) {
    return trackingApi.get({ from, to }).then(json => { dispatch(getTrackingsSuccess(json)); });
  };
}

export function getTrackingsSuccess(trackings) {
  return { type: types.GET_TRACKINGS_SUCCESS, trackings };
}

export function getTrip(tripId) {
  return function (dispatch) {
    return tripApi.getById(tripId).then(trip => {

      const consumationFilters = {
        from: trip.timestampStart,
        to: trip.timestampEnd
      };

      consumationApi.getSum(consumationFilters).then(beer => {
        dispatch(getTripSuccess({
          beer,
          trip
        }));
      });
      dispatch(getTrackings(trip.timestampStart, trip.timestampEnd));
    });
  };
}

export function getTripSuccess(data) {
  return { type: types.GET_TRIP_SUCCESS, data };
}