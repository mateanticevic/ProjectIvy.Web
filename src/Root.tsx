import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import autobind from 'autobind-decorator';

import { User } from 'types/users';
import api from './api/main';
import { NavigationBar } from './components';
import BeerPage from './pages/beer';
import CallsPage from './pages/calls';
import DashboardPage from './pages/dashboard';
import ExpensesPage from './pages/expenses';
import FlightsPage from './pages/flights';
import LoginPage from './pages/login';
import PoisPage from './pages/pois';
import ToDosPage from './pages/todos';
import TrackingPage from './pages/tracking';
import TripDetailsPage from './pages/trip-details';
import TripsPage from './pages/trips';
import CarDetailsPage from './pages/car-details';
import BeerAdminPage from './pages/beer-admin';

interface State {
  isLoggedIn: boolean;
  user?: User;
  showToast: boolean;
  toastTitle?: string;
  toastMessage?: string;
}

export default class Root extends React.Component<{}, State> {

  public state: State = {
    isLoggedIn: false,
    showToast: false,
    user: {
      modules: [],
    }
  };

  public componentDidMount() {
    const isLoggedIn = !!window.localStorage.getItem('token');

    if (isLoggedIn) {
      api.user.get().then(user => this.setState({ user }));
      this.setState({ isLoggedIn });
    }
    else if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  public render() {
    if (this.state.isLoggedIn && !this.state.user) {
      return null;
    }

    return (
      <BrowserRouter>
        <div id="main">
          {this.state.isLoggedIn &&
            <NavigationBar user={this.state.user} />
          }
          <Switch>
            <Route path="/" exact render={() => <DashboardPage user={this.state.user!} />} />
            <Route path="/beer" exact render={() => <BeerPage toast={this.toast} />} />
            <Route path="/beer/admin" exact render={() => <BeerAdminPage />} />
            <Route path="/calls" exact component={CallsPage} />
            <Route path="/car/:id" exact component={CarDetailsPage} />
            <Route path="/expenses" exact component={ExpensesPage} />
            <Route path="/flights" exact component={FlightsPage} />
            <Route path="/login" exact component={LoginPage} />
            <Route path="/pois" exact component={PoisPage} />
            <Route path="/todos" exact component={ToDosPage} />
            <Route path="/tracking" exact component={TrackingPage} />
            <Route path="/trips" exact component={TripsPage} />
            <Route path="/trips/:id" exact component={TripDetailsPage} />
          </Switch>
          <Toast
            autohide
            delay={5000}
            onClose={() => this.setState({ showToast: false })}
            show={this.state.showToast}
          >
            <Toast.Header>{this.state.toastTitle}</Toast.Header>
            <Toast.Body>{this.state.toastMessage}</Toast.Body>
          </Toast>
        </div>
      </BrowserRouter>
    );
  }

  @autobind
  private toast(title: string, message: string) {
    this.setState({
      showToast: true,
      toastMessage: message,
      toastTitle: title,
    });
  }
}
