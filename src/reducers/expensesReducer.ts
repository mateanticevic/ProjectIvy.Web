import * as types from '../constants/expensesActionTypes';
import initialState from './initialState';
import _ from 'lodash';

export default function expensesReducer(s = initialState.expenses, action) {

  switch (action.type) {

    case types.ADD_EXPENSE_SUCCESS:
      return { ...s, isModalOpen: false, expense: {} };

    case types.CHANGED_EXPENSE:
      return { ...s, expense: action.expense };

    case types.CHANGED_FILTERS:
      return { ...s, filters: action.filters };

    case types.DELETE_FILE_SUCCESS:
      const filesWithoutDeletedFile = _.filter(s.files, file => file.id != action.fileId);
      return { ...s, files: filesWithoutDeletedFile };

    case types.GET_EXPENSE_FILES_SUCCESS:
      return { ...s, expense: { ...s.expense, files: action.files } };

    case types.GET_EXPENSE_COUNT_BYDAY_SUCCESS:
      return { ...s, graphs: { ...s.graphs, count: action.data } };

    case types.EDIT_EXPENSE:
      return { ...s, expense: action.expense };

    case types.CLOSE_MODAL:
      return { ...s, isModalOpen: false };

    case types.GET_CARDS_SUCCESS:
      return { ...s, cards: action.cards };

    case types.GET_EXPENSES_SUCCESS:
      return { ...s, expenses: action.expenses };

    case types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS:
      return { ...s, graphs: { ...s.graphs, sum: action.data } };

    case types.GET_EXPENSE_SUM_BY_YEAR_SUCCESS:
      return { ...s, graphs: { ...s.graphs, sumByYear: action.data } };

    case types.GET_SUM_SUCCESS:
      let stats = { ...s.stats, sum: action.sum };
      return { ...s, stats: stats };

    case types.GET_TYPES_COUNT_SUCCESS:
      return { ...s, stats: { ...s.stats, types: action.count } };

    case types.GET_VENDORS_COUNT_SUCCESS:
      return { ...s, stats: { ...s.stats, vendors: action.count } };

    case types.GET_VENDOR_POIS_SUCCESS:
      return { ...s, vendorPois: action.pois };

    case types.NEW_EXPENSE:
      const expense = { ...initialState.expenses.expense, date: new Date() };
      return { ...s, expense: expense };

    case types.OPEN_MODAL:
      return { ...s, isModalOpen: true };

    case types.UPDATE_EXPENSE_SUCCESS:
      return { ...s, isModalOpen: false, expense: {} };

    case types.UPLOAD_FILE_SUCCESS:
      let files = s.files.slice();
      files.push(action.file);

      return { ...s, files };

    default:
      return s;
  }
}
