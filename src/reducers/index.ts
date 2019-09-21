import { combineReducers } from 'redux';
import dashboard from './dashboardReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  dashboard,
  routing: routerReducer,
  toastr: toastrReducer
});

export default rootReducer;
