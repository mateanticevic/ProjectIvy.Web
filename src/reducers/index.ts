import { combineReducers } from 'redux';
import expenses from './expensesReducer';
import flights from './flightsReducer';
import pois from './poisReducer';
import trip from './tripReducer';
import common from './commonReducer';
import dashboard from './dashboardReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  dashboard,
  expenses,
  flights,
  pois,
  trip,
  common,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
