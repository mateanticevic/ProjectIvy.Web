import * as types from '../constants/expensesActionTypes';
import initialState from './initialState';
import _ from 'lodash';

export default function expensesReducer(state = initialState.expenses, action) {

  switch (action.type) {

    case types.ADD_EXPENSE_SUCCESS:
      return {...state, isModalOpen: false, expense: {}};

    case types.CHANGED_EXPENSE:
      return {...state, expense: action.expense};

    case types.CHANGED_FILTERS:
      return {...state, filters: action.filters };

    case types.DELETE_FILE_SUCCESS:
      const filesWithoutDeletedFile = _.filter(state.files, file => file.id != action.fileId);
      return {...state, files: filesWithoutDeletedFile};

    case types.GET_EXPENSE_FILES_SUCCESS:
      return {...state, expense: {...state.expense, files: action.files}};

    case types.GET_EXPENSE_COUNT_BYDAY_SUCCESS:
      return {...state, graphs: { ...state.graphs, count: action.data } };

    case types.EDIT_EXPENSE:
      return {...state, expense: action.expense};

    case types.CLOSE_MODAL:
      return {...state, isModalOpen: false};

    case types.GET_CARDS_SUCCESS:
      return {...state, cards: action.cards};

    case types.GET_EXPENSES_SUCCESS:
      return {...state, expenses: action.expenses};

    case types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS:
    return {...state, graphs: { ...state.graphs, sum: action.data } };

    case types.GET_SUM_SUCCESS:
      let stats = {...state.stats, sum: action.sum };
      return {...state, stats: stats};

    case types.GET_TYPES_COUNT_SUCCESS:
      return {...state, stats: {...state.stats, types: action.count} };

    case types.GET_VENDORS_COUNT_SUCCESS:
      return {...state, stats: {...state.stats, vendors: action.count} }; 

    case types.GET_VENDOR_POIS_SUCCESS:
      return {...state, vendorPois: action.pois };

    case types.NEW_EXPENSE:
      const expense = {...initialState.expenses.expense, date: new Date()};
      return {...state, expense: expense};

    case types.OPEN_MODAL:
      return {...state, isModalOpen: true};

    case types.UPDATE_EXPENSE_SUCCESS:
      return {...state, isModalOpen: false, expense: {}};

    case types.UPLOAD_FILE_SUCCESS:
      let files = state.files.slice();
      files.push(action.file);

      return {...state, files};

    default:
      return state;
  }
}
