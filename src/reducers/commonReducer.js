import * as types from '../constants/expensesActionTypes';
import * as commonTypes from '../constants/commonActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function commonReducer(state = initialState.common, action) {

  switch (action.type) {

    case types.GET_CURRENCIES_SUCCESS:
      return objectAssign({}, state, {currencies: action.currencies});

    case types.GET_EXPENSE_TYPES_SUCCESS:
      return objectAssign({}, state, {expenseTypes: action.expenseTypes});

    case types.GET_PAYMENT_TYPES_SUCCESS:
      return objectAssign({}, state, {paymentTypes: action.paymentTypes});

    case commonTypes.GET_POI_CATEGORIES_SUCCESS:
      return objectAssign({}, state, {poiCategories: action.poiCategories});

    case types.GET_VENDORS_SUCCESS:
      return objectAssign({}, state, {vendors: action.vendors});

    default:
      return state;
  }
}