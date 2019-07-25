import { combineReducers } from 'redux';
import pois from './poisReducer';
import dashboard from './dashboardReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  dashboard,
  pois,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
