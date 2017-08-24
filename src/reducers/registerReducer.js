import * as types from '../constants/expensesActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function registerReducer(state = initialState.registers, action) {

  switch (action.type) {

    case types.GET_CURRENCIES_SUCCESS:
      return objectAssign({}, state, {currencies: action.currencies});

    case types.GET_EXPENSE_TYPES_SUCCESS:
      return objectAssign({}, state, {expenseTypes: action.expenseTypes});

    case types.GET_PAYMENT_TYPES_SUCCESS:
      return objectAssign({}, state, {paymentTypes: action.paymentTypes});

    case types.GET_VENDORS_SUCCESS:
      return objectAssign({}, state, {vendors: action.vendors});

    default:
      return state;
  }
}
