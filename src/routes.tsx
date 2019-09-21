import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import DashboardPage from './containers/DashboardPage';
import BeerPage from './pages/beer';
import CallsPage from './pages/calls';
import ExpensesPage from './pages/expenses';
import FlightsPage from './pages/flights';
import LoginPage from './pages/login';
import TrackingPage from './pages/tracking';
import TripsPage from './pages/trips';
import TripDetailsPage from './pages/trip-details';
import PoisPage from './pages/pois';
import ToDosPage from './pages/todos';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage}/>
    <Route path="beer" component={BeerPage}/>
    <Route path="calls" component={CallsPage}/>
    <Route path="expenses" component={ExpensesPage}/>
    <Route path="flights" component={FlightsPage}/>
    <Route path="login" component={LoginPage}/>
    <Route path="pois" component={PoisPage}/>
    <Route path="todos" component={ToDosPage}/>
    <Route path="tracking" component={TrackingPage}/>
    <Route path="trips" component={TripsPage}/>
    <Route path="trips/:id" component={TripDetailsPage}/>
  </Route>
);
