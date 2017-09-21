import * as types from '../constants/expensesActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function expensesReducer(state = initialState.expenses, action) {

  switch (action.type) {

    case types.ADD_EXPENSE_SUCCESS:
      return objectAssign({}, state, {isModalOpen: false, expense: {}});

    case types.CHANGED_EXPENSE:
      return objectAssign({}, state, {expense: action.expense});

    case types.CHANGED_FILTERS:
      return objectAssign({}, state, { filters: action.filters, stats: {} });

    case types.EDIT_EXPENSE:
      return objectAssign({}, state, {expense: action.expense});

    case types.CLOSE_MODAL:
      return objectAssign({}, state, {isModalOpen: false});

    case types.GET_CARDS_SUCCESS:
      return objectAssign({}, state, {cards: action.cards});

    case types.GET_EXPENSES_SUCCESS:
      return objectAssign({}, state, {expenses: action.expenses});

    case types.GET_SUM_SUCCESS:
      let stats = objectAssign({}, state.stats, { sum: action.sum });
      return objectAssign({}, state, {stats: stats});

    case types.GET_VENDOR_POIS_SUCCESS:
      return objectAssign({}, state, {vendorPois: action.pois});

    case types.NEW_EXPENSE:
      let expense = objectAssign({}, initialState.expenses.expense, {date: action.expense});
      return objectAssign({}, state, {expense: expense});

    case types.OPEN_MODAL:
      return objectAssign({}, state, {isModalOpen: true});

    case types.UPDATE_EXPENSE_SUCCESS:
      return objectAssign({}, state, {isModalOpen: false, expense: {}});

    default:
      return state;
  }
}
