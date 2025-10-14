import moment from 'moment';
import React from 'react';
import { Col, Container, Card, Row, Carousel, Badge } from 'react-bootstrap';
import { Marker, Polyline } from '@react-google-maps/api';
import 'react-vertical-timeline-component/style.min.css';
import './styles.scss';
import AsyncSelect from 'react-select/async';
import { useParams } from 'react-router';
import { FaPencilAlt } from 'react-icons/fa';

import api from 'api/main';
import { Map, ValueLabel } from 'components';
import ExpensePanel from '../expenses/expense-panel';
import { Ride, RideBinding } from 'types/ride';
import Timeline from './timeline';
import StayModal from '../trips/stay-modal';
import { cityLoader, expenseLoader } from 'utils/select-loaders';
import { UserContext } from 'contexts/user-context';
import { components } from 'types/ivy-types';
import { User } from 'types/users';
import { iconUrl } from 'utils/cdn-helper';

type Flight = components['schemas']['Flight'];
type Trip = components['schemas']['Trip'];
type Stay = components['schemas']['Stay'];

interface QueryStrings {
    id: string;
}

interface Props {
    params: QueryStrings;
}

interface State {
    beerSum: number;
    expenseFilters: any;
    flights: Flight[];
    isRideModalOpen: boolean;
    isStayModalOpen: boolean;
    ride: RideBinding;
    rides: Ride[];
    selectedStay: Stay | null;
    stays: any[];
    trackings: any[];
    trip: Trip;
}

class TripDetailsPage extends React.Component<Props, State> {

    map?: google.maps.Map;

    user = this.context as User;
    
    state: State = {
        beerSum: 0,
        expenseFilters: {
            page: 1,
            pageSize: 10,
        },
        flights: [],
        isRideModalOpen: true,
        isStayModalOpen: false,
        ride: {
            typeId: 'car'
        },
        rides: [],
        selectedStay: null,
        stays: [],
        trip: {
            cities: [],
            countries: [],
            expenses: [],
            id: '',
            stays: [],
        },
        trackings: [],
    };

    componentDidMount() {
        api.trip.getById(this.props.params.id)
            .then(trip => {
                this.setState({ trip });
                const filters = { from: trip.timestampStart, to: trip.timestampEnd };
                api.consumation.getSum(filters).then(beerSum => this.setState({ beerSum }));
                api.flight.get(filters).then(flights => this.setState({ flights: flights.items }));
                api.ride.get(filters).then(rides => this.setState({ rides }));
                api.tracking.get(filters).then(trackings => {
                    this.setState({ trackings });
                    const bounds = new google.maps.LatLngBounds();
                    trackings.forEach(tracking => bounds.extend(tracking));
                    this.map?.fitBounds(bounds);
                });
            });
    }

    render() {
        const { beerSum, trackings, trip } = this.state;

        const days = moment(trip.timestampEnd).diff(moment(trip.timestampStart), 'days') + 1;

        const poiMarkers = trip.pois != null ? trip.pois.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.latitude, lng: poi.longitude }} title={poi.name} />) : null;

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Body className="padding-0">
                                <Carousel>
                                    {trip.files &&
                                        trip.files.map(file =>
                                            <Carousel.Item key={file.id}>
                                                <img
                                                    className="d-block w-100"
                                                    src={`/api/file/${file.id}`}
                                                />
                                                <Carousel.Caption>
                                                    <h1>{trip.name}</h1>
                                                    <p>{moment(trip.timestampStart).format('MMMM YYYY')}</p>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        )
                                    }
                                </Carousel>
                            </Card.Body>
                            <Card.Footer>
                                <Row>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            label="Days"
                                            value={days}
                                        />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            round
                                            label="Distance"
                                            unit="km"
                                            value={Number(trip.distance / 1000)}
                                        />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            round
                                            label="Spent"
                                            unit={this.user.defaultCurrency.symbol}
                                            value={Number(trip.totalSpent)}
                                        />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            label="Cities"
                                            value={trip.cities.length}
                                        />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            label="Countries"
                                            value={trip.countries.length}
                                        />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel
                                            label="Beer"
                                            unit="L"
                                            value={Math.ceil(beerSum / 1000)}
                                        />
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-medium">
                                <Map onLoad={map => this.map = map}>
                                    {trip.cities?.map(city =>
                                        <Marker
                                            key={city.id}
                                            icon={iconUrl('location-small')}
                                            position={{ lat: city.lat, lng: city.lng }}
                                            title={city.name}
                                        />
                                    )}
                                    {poiMarkers}
                                    <Polyline path={trackings} />
                                </Map>
                            </Card.Body>
                        </Card>
                        {trip.cities?.map(city =>
                            <Badge onClick={() => this.deleteCity(city.id)}>{city.name}</Badge>
                        )}
                        <AsyncSelect
                            loadOptions={cityLoader}
                            onChange={city => this.addCity(city.value)}
                            defaultOptions
                        />
                        <AsyncSelect
                            loadOptions={expenseLoader}
                            onChange={expense => this.addExpense(expense.value)}
                            defaultOptions
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <ExpensePanel
                            expenses={{ items: trip.expenses, count: trip.expenses.length }}
                            page={this.state.expenseFilters.page}
                            pageSize={this.state.expenseFilters.pageSize}
                            onPageChange={this.onExpensePageChange}
                            onUnlink={this.onUnlink} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Stays</Card.Header>
                            <Card.Body>
                                {trip.stays!.length > 0 ? (
                                    <div className="stays-container">
                                        {trip.stays!.map((stay, index) => (
                                            <div key={stay.id || index} className="stay-item">
                                                <div className="stay-content">
                                                    <strong>{stay.city?.name || 'Unnamed Stay'}</strong>
                                                    <div className="text-muted small">
                                                        {moment(stay.from).format('MMM DD')} - {moment(stay.to).diff(moment(stay.from), 'days')} nights
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-link stay-edit-btn"
                                                    onClick={() => this.onEditStay(stay)}
                                                    title="Edit stay"
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">No stays recorded for this trip.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Timeline
                            from={moment(trip.timestampStart)}
                            flights={this.state.flights}
                            rides={this.state.rides}
                            to={moment(trip.timestampEnd)}
                        />
                    </Col>
                </Row>
                <StayModal
                    buttonIsLoading={false}
                    isOpen={this.state.isStayModalOpen}
                    stay={this.state.selectedStay}
                    onClose={() => this.setState({ isStayModalOpen: false, selectedStay: null })}
                    onChange={this.onStayChange}
                    onSave={this.onStaySave}
                    countries={trip.countries || []}
                />
                {/* <RideModal
                    isOpen={this.state.isRideModalOpen}
                    onChange={this.onRideChange}
                    onClose={() => this.setState({ isRideModalOpen: false })}
                    onSave={this.onRideSave}
                /> */}
            </Container>
        );
    }

    addCity = (cityId: string) => {
        api.trip.postCity(this.state.trip.id!, cityId);
    };

    addExpense = (expenseId: string) => {
        api.trip.postExpense(this.state.trip.id!, expenseId);
    }

    deleteCity = (cityId: string) => {
        api.trip.deleteCity(this.state.trip.id!, cityId);
    };

    onExpensePageChange = (page) => {
        this.setState({
            expenseFilters: {
                ...this.state.expenseFilters,
                page,
            },
        });
    };

    onRideChange = (changed: Partial<RideBinding>) => {
        this.setState({
            ride: {
                ...this.state.ride,
                ...changed,
            }
        });
    };

    onRideSave = () => {
        api.ride.post(this.state.ride);
    };

    onUnlink = (expenseId) => {
        api.trip
            .deleteExpense(this.state.trip.id, expenseId)
            .then(() => { });
    };

    onEditStay = (stay: Stay) => {
        this.setState({
            selectedStay: stay,
            isStayModalOpen: true,
        });
    };

    onStayChange = (changed: Partial<Stay>) => {
        this.setState({
            selectedStay: {
                ...this.state.selectedStay,
                ...changed,
            } as Stay,
        });
    };

    onStaySave = () => {
        const { selectedStay, trip } = this.state;
        if (!selectedStay || !selectedStay.id) return;

        const stayBinding = {
            from: selectedStay.from,
            to: selectedStay.to,
            cityId: selectedStay.city?.id,
            countryId: selectedStay.city?.country?.id,
        };

        api.stay.put(String(selectedStay.id), stayBinding)
            .then(() => {
                // Refresh trip data
                api.trip.getById(trip.id!).then(updatedTrip => {
                    this.setState({
                        trip: updatedTrip,
                        isStayModalOpen: false,
                        selectedStay: null,
                    });
                });
            });
    };
}

TripDetailsPage.contextType = UserContext;

export default () =>
    <TripDetailsPage params={useParams() as QueryStrings} />;
