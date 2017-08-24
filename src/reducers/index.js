import { combineReducers } from 'redux';
import expenses from './expensesReducer';
import login from './loginReducer';
import trips from './tripsReducer';
import registers from './registerReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  expenses,
  login,
  trips,
  registers,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
