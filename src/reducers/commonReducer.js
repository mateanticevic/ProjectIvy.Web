import * as types from '../constants/expensesActionTypes';
import * as commonTypes from '../constants/commonActionTypes';
import initialState from './initialState';

export default function commonReducer(s = initialState.common, action) {

  switch (action.type) {

    case types.GET_CURRENCIES_SUCCESS:
      return {...s, currencies: action.currencies};

    case types.GET_EXPENSE_TYPES_SUCCESS:
      return {...s, expenseTypes: action.expenseTypes};

      case commonTypes.GET_EXPENSE_FILE_TYPES_SUCCESS:
      return {...s, expenseFileTypes: action.expenseFileTypes};

    case types.GET_PAYMENT_TYPES_SUCCESS:
      return {...s, paymentTypes: action.paymentTypes};

    case commonTypes.GET_POI_CATEGORIES_SUCCESS:
      return {...s, poiCategories: action.poiCategories};

    case commonTypes.GET_VENDORS_SUCCESS:
      return {...s, vendors: action.vendors.items};

    default:
      return s;
  }
}
