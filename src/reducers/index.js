import { combineReducers } from 'redux';
import expenses from './expensesReducer';
import login from './loginReducer';
import pois from './poisReducer';
import trips from './tripsReducer';
import trip from './tripReducer';
import common from './commonReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  expenses,
  login,
  pois,
  trips,
  trip,
  common,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
