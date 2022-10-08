import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toast } from 'react-bootstrap';

import { User } from 'types/users';
import api from './api/main';
import { NavigationBar } from './components';
import AccountPage from './pages/account';
import BeerPage from './pages/beer';
import CallsPage from './pages/calls';
import DashboardPage from './pages/dashboard';
import ExpensesPage from './pages/expenses';
import FlightsPage from './pages/flights';
import IncomesPage from './pages/incomes';
import PoisPage from './pages/pois';
import TrackingPage from './pages/tracking';
import TripDetailsPage from './pages/trip-details';
import TripsPage from './pages/trips';
import CarDetailsPage from './pages/car-details';
import BeerAdminPage from './pages/beer-admin';
import MoviesPage from './pages/movies';
import { UserContext } from './contexts/user-context';
import LocationPage from 'pages/location';
import { getIdentity } from 'utils/cookie-helper';
import AccountsPage from 'pages/accounts';

interface State {
    user: User;
    showToast: boolean;
    toastTitle?: string;
    toastMessage?: string;
}

export default class Root extends React.Component<{}, State> {
    identity = getIdentity();

    public state: State = {
        showToast: false,
    };

    componentDidMount() {
        if (window.location.hash) {
            const params = new URLSearchParams(window.location.hash.substring(1));
            document.cookie = `IdToken=${params.get('id_token')}`;
            document.cookie = `AccessToken=${params.get('access_token')};domain=${process.env.ACCESS_TOKEN_COOKIE_DOMAIN};`;
            history.replaceState(null, null, ' ');
        }

        if (this.identity) {
            api.user.get().then(user => this.setState({ user }));
        }
    }

    public render() {

        return this.state.user ? (
            <UserContext.Provider value={this.state.user}>
                <BrowserRouter>
                    <div id="main">
                        {this.identity &&
                            <NavigationBar identity={this.identity} />
                        }
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/accounts" element={<AccountsPage />} />
                            <Route path="/beer" element={<BeerPage toast={this.toast} />} />
                            <Route path="/beer/admin" element={<BeerAdminPage />} />
                            <Route path="/calls" element={<CallsPage />} />
                            <Route path="/car/:id" element={<CarDetailsPage />} />
                            <Route path="/expenses" element={<ExpensesPage />} />
                            <Route path="/flights" element={<FlightsPage />} />
                            <Route path="/incomes" element={<IncomesPage />} />
                            <Route path="/location" element={<LocationPage />} />
                            <Route path="/movies" element={<MoviesPage />} />
                            <Route path="/pois" element={<PoisPage />} />
                            <Route path="/tracking" element={<TrackingPage />} />
                            <Route path="/trips" element={<TripsPage />} />
                            <Route path="/trips/:id" element={<TripDetailsPage />} />
                        </Routes>
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
            </UserContext.Provider>
        ) : "loading";
    }

    toast = (title: string, message: string) => {
        this.setState({
            showToast: true,
            toastMessage: message,
            toastTitle: title,
        });
    }
}
