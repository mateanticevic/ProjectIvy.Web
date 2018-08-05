import { combineReducers } from 'redux';
import beer from './beerReducer';
import expenses from './expensesReducer';
import flights from './flightsReducer';
import login from './loginReducer';
import pois from './poisReducer';
import trips from './tripsReducer';
import trip from './tripReducer';
import common from './commonReducer';
import dashboard from './dashboardReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  dashboard,
  beer,
  expenses,
  flights,
  login,
  pois,
  trips,
  trip,
  common,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
