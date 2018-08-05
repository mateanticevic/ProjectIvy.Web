import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import DashboardPage from './containers/DashboardPage';
import BeerPage from './containers/BeerPage';
import ExpensesPage from './containers/ExpensesPage';
import FlightsPage from './containers/FlightsPage';
import LoginPage from './containers/LoginPage';
import TripsPage from './containers/TripsPage';
import TripPage from './containers/TripPage';
import PoisPage from './containers/PoisPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage}/>
    <Route path="beer" component={BeerPage}/>
    <Route path="expenses" component={ExpensesPage}/>
    <Route path="flights" component={FlightsPage}/>
    <Route path="login" component={LoginPage}/>
    <Route path="pois" component={PoisPage}/>
    <Route path="trips" component={TripsPage}/>
    <Route path="trips/:id" component={TripPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
