import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import ExpensesPage from './containers/ExpensesPage';
import LoginPage from './containers/LoginPage';
import TripsPage from './containers/TripsPage';
import TripPage from './containers/TripPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="expenses" component={ExpensesPage}/>
    <Route path="login" component={LoginPage}/>
    <Route path="trips" component={TripsPage}/>
    <Route path="trips/:id" component={TripPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
