import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BeerPage from './pages/beer';
import { NavigationBar } from './components/common';
import CallsPage from './pages/calls';
import ExpensesPage from './pages/expenses';
import FlightsPage from './pages/flights';
import LoginPage from './pages/login';
import PoisPage from './pages/pois';
import ToDosPage from './pages/todos';
import TrackingPage from './pages/tracking';
import TripsPage from './pages/trips';
import TripDetailsPage from './pages/trip-details';
import DashboardPage from './pages/dashboard';
import { User } from 'types/users';
import { userApi } from './api/main';

type State = {
  user?: User
}

export default class Root extends Component<{}, State> {

  state: State = {
    user: undefined
  }

  componentDidMount() {
    userApi.get().then(user => this.setState({ user }));
  }

  render() {
    const isLoggedIn = window.localStorage.getItem("token") != undefined;

    return (
      <BrowserRouter>
        <div id="main">
          {isLoggedIn &&
            <NavigationBar user={this.state.user} />
          }
          <div>
            <Switch>
              <Route path="/" exact component={DashboardPage} />
              <Route path="/beer" exact component={BeerPage} />
              <Route path="/calls" exact component={CallsPage} />
              <Route path="/expenses" exact component={ExpensesPage} />
              <Route path="/flights" exact component={FlightsPage} />
              <Route path="/login" exact component={LoginPage} />
              <Route path="/pois" exact component={PoisPage} />
              <Route path="/todos" exact component={ToDosPage} />
              <Route path="/tracking" exact component={TrackingPage} />
              <Route path="/trips" exact component={TripsPage} />
              <Route path="/trips/:id" exact component={TripDetailsPage} />
            </Switch>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
        </div>
      </BrowserRouter>
    );
  }
}
