import * as types from '../constants/expensesActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';
import _ from 'lodash';

export default function expensesReducer(state = initialState.expenses, action) {

  switch (action.type) {

    case types.ADD_EXPENSE_SUCCESS:
      return objectAssign({}, state, {isModalOpen: false, expense: {}});

    case types.CHANGED_EXPENSE:
      return objectAssign({}, state, {expense: action.expense});

    case types.CHANGED_FILTERS:
      return objectAssign({}, state, { filters: action.filters, stats: {} });

    case types.DELETE_FILE_SUCCESS:
      const filesWithoutDeletedFile = _.filter(state.files, file => file.id != action.fileId);
      return {...state, files: filesWithoutDeletedFile};

    case types.GET_EXPENSE_FILES_SUCCESS:
      return {...state, expense: {...state.expense, files: action.files}};

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

    case types.GET_TYPES_COUNT_SUCCESS:
      return {...state, stats: {...state.stats, types: action.count} };

    case types.GET_VENDORS_COUNT_SUCCESS:
      return {...state, stats: {...state.stats, vendors: action.count} }; 

    case types.GET_VENDOR_POIS_SUCCESS:
      const poiId = action.pois != undefined && action.pois.length > 0 ? action.pois[0].id : null;
      const expenseWithPoiId = {...state.expense, poiId: poiId};
      return objectAssign({}, state, { vendorPois: action.pois, expense: expenseWithPoiId });

    case types.NEW_EXPENSE:
      const expense = objectAssign({}, initialState.expenses.expense, {date: new Date()});
      return objectAssign({}, state, {expense: expense});

    case types.OPEN_MODAL:
      return objectAssign({}, state, {isModalOpen: true});

    case types.UPDATE_EXPENSE_SUCCESS:
      return objectAssign({}, state, {isModalOpen: false, expense: {}});

    case types.UPLOAD_FILE_SUCCESS:
      let files = state.files.slice();
      files.push(action.file);

      return {...state, files};

    default:
      return state;
  }
}
