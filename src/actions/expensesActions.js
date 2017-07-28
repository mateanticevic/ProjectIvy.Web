import * as types from '../constants/expensesActionTypes';
import * as currencyApi from '../api/main/currency';
import * as vendorApi from '../api/main/vendor';
import * as expenseApi from '../api/main/expense';
import * as expenseTypeApi from '../api/main/expenseType';
import {toastr} from 'react-redux-toastr';

export function addExpense(expense, filters) {
  return function (dispatch) {
    return expenseApi.put(expense).then(id => {
      toastr.success('Success', 'Expense #' + id + ' added.');
      dispatch(addExpenseSuccess());
      dispatch(getExpenses(filters));
    });
  };
}

export function addExpenseAnother(expense, filters) {
  return function (dispatch) {
    return expenseApi.put(expense).then(id => {
      toastr.success('Success', 'Expense #' + id + ' added.');
      dispatch(addExpenseAnotherSuccess());
      dispatch(getExpenses(filters));
    });
  };
}

export function addExpenseSuccess() {
  return {type: types.ADD_EXPENSE_SUCCESS};
}

export function addExpenseAnotherSuccess() {
  return {type: types.ADD_EXPENSE_ANOTHER_SUCCESS};
}

export function changedExpense(expense) {
  return {type: types.CHANGED_EXPENSE, expense};
}

export function changedFilters(filters) {
  return function (dispatch) {
    dispatch(getExpenses(filters));
    return dispatch({type: types.CHANGED_FILTERS, filters});
  };
}

export function closeModal() {
  return {type: types.CLOSE_MODAL};
}

export function getCurrencies() {

  return function (dispatch) {
    return currencyApi.get().then(json => { dispatch(getCurrenciesSuccess(json)); } );
  };
}

export function getCurrenciesSuccess(currencies) {
  return {type: types.GET_CURRENCIES_SUCCESS, currencies};
}

export function getExpenses(filters) {
  return function (dispatch) {
    return expenseApi.get(filters).then(json => { dispatch(getExpensesSuccess(json)); } );
  };
}

export function getExpensesSuccess(expenses) {
  return {type: types.GET_EXPENSES_SUCCESS, expenses};
}

export function getVendors() {
  return function (dispatch) {
    return vendorApi.get().then(json => { dispatch(getVendorsSuccess(json)); } );
  };
}

export function getVendorsSuccess(vendors) {
  return {type: types.GET_VENDORS_SUCCESS, vendors};
}

export function getExpenseTypes(filters) {

  return function (dispatch) {
    return expenseTypeApi.get(filters).then(json => { dispatch(getExpenseTypesSuccess(json)); } );
  };
}

export function getExpenseTypesSuccess(expenseTypes) {
  return {type: types.GET_EXPENSE_TYPES_SUCCESS, expenseTypes};
}

export function getVendorPoisSuccess(pois) {
  return {type: types.GET_VENDOR_POIS_SUCCESS, pois};
}

export function openModal() {
  return {type: types.OPEN_MODAL};
}

export function onVendorChanged(vendorId) {
  return function (dispatch) {
    return vendorApi.getPois(vendorId).then(json => { dispatch(getVendorPoisSuccess(json)); } );
  };
}