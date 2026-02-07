import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Button, Card, FloatingLabel, Form, Spinner, Toast } from 'react-bootstrap';

import { User } from 'types/users';
import api from './api/main';
import { NavigationBar } from './components';
import BeerPage from './pages/beer';
import CallsPage from './pages/calls';
import DashboardPage from './pages/dashboard';
import ExpensesPage from './pages/expenses';
import FlightsPage from './pages/flights';
import IncomesPage from './pages/incomes';
import PoisPage from './pages/pois';
import TrackingOldPage from './pages/tracking-old';
import TripDetailsPage from './pages/trip-details';
import TripsPage from './pages/trips';
import CarDetailsPage from './pages/car-details';
import BeerAdminPage from './pages/beer-admin';
import MoviesPage from './pages/movies';
import { UserContext } from './contexts/user-context';
import TrackingPage from 'pages/tracking';
import { getIdentity } from 'utils/cookie-helper';
import AccountsPage from 'pages/accounts';
import FlightsV2Page from 'pages/flights-v2';
import ButtonWithSpinner from 'components/button-with-spinner';
import { FaGithub, FaMicrosoft } from 'react-icons/fa';
import CalendarMonthPage from 'pages/calendar-month';
import PlacesPage from 'pages/places';
import { CalendarYearPage } from 'pages/calendar-year';
import InventoryPage from 'pages/inventory';
import ExpenseTypesPage from 'pages/expense-types';

interface State {
    error?: string,
    loadingState: LoadingState,
    loggingIn?: boolean;
    password?: string;
    showToast: boolean;
    theme: 'light' | 'dark';
    toastTitle?: string;
    toastMessage?: string;
    user?: User;
    username?: string;
}

enum LoadingState {
    Error,
    Login,
    Ready,
    Waiting,
}

const loginWithOAuthProviderUrl = `https://auth.anticevic.net/realms/ivy/protocol/openid-connect/auth?client_id=web&redirect_uri=${import.meta.env.VITE_APP_URL}&response_type=code&scope=openid`;

export default class Root extends React.Component<{}, State> {
    identity = getIdentity();

    public state: State = {
        loadingState: LoadingState.Waiting,
        showToast: false,
        theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    };

    componentDidMount() {
        // Apply theme to html element
        document.documentElement.setAttribute('data-bs-theme', this.state.theme);
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetch(`${import.meta.env.VITE_AUTH_URL}/realms/ivy/protocol/openid-connect/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: import.meta.env.VITE_APP_URL,
                    client_id: 'web',
                }).toString()
            })
                .then(response => response.json())
                .then(data => {
                    document.cookie = `AccessToken=${data.access_token};domain=${import.meta.env.VITE_ACCESS_TOKEN_COOKIE_DOMAIN};`;
                    location = '/';
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }

        if (this.identity) {
            api.user.get()
                .then(user => {
                    this.setState({
                        loadingState: LoadingState.Ready,
                        user,
                    });
                })
                .catch(error => {
                    this.setState({
                        error: error.message,
                        loadingState: LoadingState.Error,
                    });
                });
        }
        else {
            this.setState({
                loadingState: LoadingState.Login,
            });
        }
    }

    login = () => {
        this.setState({
            loggingIn: true,
        });

        const payload = { username: this.state.username, password: this.state.password, grant_type: 'password', scope: 'email' };

        var formBody: string[] = [];
        for (var property in payload) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(payload[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        fetch(`${import.meta.env.VITE_AUTH_URL}/realms/ivy/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                Authorization: 'Basic d2ViOg==',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.join("&")
        })
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        document.cookie = `AccessToken=${data.access_token};domain=${import.meta.env.VITE_ACCESS_TOKEN_COOKIE_DOMAIN};`;
                        location.reload();
                    });
                }
                else {
                    this.setState({
                        loggingIn: false,
                    });
                }
            })
            .catch(error => {
                this.setState({
                    error: error.message,
                    loadingState: LoadingState.Error,
                });
            });
    }

    public render() {

        switch (this.state.loadingState) {
            case LoadingState.Error: {
                return (
                    <div className="loading-status">
                        <p>API failed with {this.state.error}</p>
                    </div >
                );
            }
            case LoadingState.Login: {
                return (
                    <div className="login-form">
                        <Card>
                            <Card.Body>
                                <Form>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="User"
                                        className="mb-3"
                                    >
                                        <Form.Control type="text" onChange={x => this.setState({ username: x.target.value })} />
                                    </FloatingLabel>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Password"
                                        className="mb-3"
                                    >
                                        <Form.Control type="password" onChange={x => this.setState({ password: x.target.value })} />
                                    </FloatingLabel>
                                    <div className="form-grid">
                                        <ButtonWithSpinner
                                            isLoading={!!this.state.loggingIn}
                                            onClick={this.login}
                                        >Log in</ButtonWithSpinner>
                                        <Button
                                            variant="primary"
                                            href={`${loginWithOAuthProviderUrl}&kc_idp_hint=microsoft`}
                                        >
                                            <FaMicrosoft /> Log in with Microsoft
                                        </Button>
                                        <Button
                                            variant="primary"
                                            href={`${loginWithOAuthProviderUrl}&kc_idp_hint=github`}
                                        >
                                            <FaGithub /> Log in with GitHub
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                );
            }
            case LoadingState.Ready: {
                return (
                    <UserContext.Provider value={this.state.user!}>
                        <BrowserRouter>
                            <div id="main">
                                {this.identity &&
                                    <NavigationBar 
                                        identity={this.identity} 
                                        theme={this.state.theme}
                                        onThemeToggle={this.toggleTheme}
                                    />
                                }
                                <Routes>
                                    <Route path="/" element={<DashboardPage />} />
                                    <Route path="/accounts" element={<AccountsPage />} />
                                    <Route path="/beer" element={<BeerPage toast={this.toast} />} />
                                    <Route path="/beer/admin" element={<BeerAdminPage />} />
                                    <Route path="/calendar" element={<CalendarYearPage />} />
                                    <Route path="/calendar/:year" element={<CalendarYearPage />} />
                                    <Route path="/calendar/:year/:month" element={<CalendarMonthPage />} />
                                    <Route path="/calls" element={<CallsPage />} />
                                    <Route path="/car/:id" element={<CarDetailsPage />} />
                                    <Route path="/expenses" element={<ExpensesPage toast={this.toast} />} />
                                    <Route path="/expense-types" element={<ExpenseTypesPage />} />
                                    <Route path="/flights" element={<FlightsV2Page />} />
                                    <Route path="/flights-old" element={<FlightsPage />} />
                                    <Route path="/incomes" element={<IncomesPage />} />
                                    <Route path="/inventory" element={<InventoryPage />} />
                                    <Route path="/movies" element={<MoviesPage />} />
                                    <Route path="/places" element={<PlacesPage />} />
                                    <Route path="/pois" element={<PoisPage />} />
                                    <Route path="/tracking" element={<TrackingPage />} />
                                    <Route path="/tracking-old" element={<TrackingOldPage />} />
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
                );
            }
            case LoadingState.Waiting: {
                return (
                    <div className="loading-status">
                        <p>Connecting to the api...</p >
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            variant="primary"
                        />
                    </div >
                );
            }
            default: {
                return 'error';
            }
        }
    }

    toast = (title: string, message: string) => {
        this.setState({
            showToast: true,
            toastMessage: message,
            toastTitle: title,
        });
    };

    toggleTheme = () => {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setState({ theme: newTheme });
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
    };
}
