import * as types from '../constants/expensesActionTypes';
import * as currencyApi from '../api/main/currency';
import * as cardApi from '../api/main/card';
import * as fileApi from '../api/main/file';
import * as vendorApi from '../api/main/vendor';
import * as expenseApi from '../api/main/expense';
import * as expenseTypeApi from '../api/main/expenseType';
import * as paymentTypesApi from '../api/main/paymentType';
import { toastr } from 'react-redux-toastr';

export function addExpense(expense, filters) {
  return function (dispatch) {
    return expenseApi.post(expense).then(id => {
      toastr.success('Success', 'Expense #' + id + ' added.');
      dispatch(addExpenseSuccess());
      dispatch(getExpenses(filters));
    });
  };
}

export function addExpenseAnother(expense, filters) {
  return function (dispatch) {
    return expenseApi.post(expense).then(id => {
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

export function editExpense(expense) {
  return {type: types.EDIT_EXPENSE, expense};
}

export function changedFilters(filters) {
  return function (dispatch) {
    dispatch(getExpenses(filters));
    dispatch(getSum(filters));
    return dispatch({type: types.CHANGED_FILTERS, filters});
  };
}

export function closeModal() {
  return {type: types.CLOSE_MODAL};
}

export function deleteFile(fileId) {
  return function (dispatch) {
    return fileApi.deleteFile(fileId).then(() => {
      toastr.success('Success', 'File deleted');
    });
  };
}

export function getCards() {

  return function (dispatch) {
    return cardApi.get().then(json => { dispatch(getCardsSuccess(json)); } );
  };
}

export function getCardsSuccess(cards) {
  return {type: types.GET_CARDS_SUCCESS, cards};
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

export function getPaymentTypes() {

  return function (dispatch) {
    return paymentTypesApi.get().then(json => { dispatch(getPaymentTypesSuccess(json)); } );
  };
}

export function getPaymentTypesSuccess(paymentTypes) {
  return {type: types.GET_PAYMENT_TYPES_SUCCESS, paymentTypes};
}

export function getSum(filters) {
  return function (dispatch) {
    return expenseApi.getSum(filters).then(json => { dispatch(getSumSuccess(json)); } );
  };
}

export function getSumSuccess(sum) {
  return {type: types.GET_SUM_SUCCESS, sum};
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

export function linkExpenseFile(expenseId, expenseFile) {
  return function () {
    return expenseApi.postFile(expenseId, expenseFile.file.id, { name: expenseFile.name, typeId: expenseFile.type }).then(() => {
      toastr.success('File linked.');
    });
  };
}

export function openModal() {
  return {type: types.OPEN_MODAL};
}

export function onNewExpense() {
  return {type: types.NEW_EXPENSE};
}

export function onVendorChanged(vendorId) {
  return function (dispatch) {
    return vendorApi.getPois(vendorId).then(json => { dispatch(getVendorPoisSuccess(json)); } );
  };
}

export function updateExpense(expense, filters) {
  return function (dispatch) {
    return expenseApi.put(expense).then(() => {
      toastr.success('Success', 'Expense #' + expense.id + ' updated.');
      dispatch(updateExpenseSuccess());
      dispatch(getExpenses(filters));
    });
  };
}

export function updateExpenseSuccess() {
  return {type: types.UPDATE_EXPENSE_SUCCESS};
}

export function uploadFileSuccess(file){
  return {type: types.UPLOAD_FILE_SUCCESS, file};
}

export function uploadFiles(files) {
  return function (dispatch) {
    
    files.map(file => {
      console.log(file);
      return fileApi.post(file).then((fileId) => {
        toastr.success('Success', 'File uploaded ' + fileId);
        dispatch(uploadFileSuccess({
          name: file.name,
          type: file.type,
          size: file.size,
          id: fileId
        }));
      });
    });

    return dispatch({type: types.UPLOADED_FILES});
  };
}