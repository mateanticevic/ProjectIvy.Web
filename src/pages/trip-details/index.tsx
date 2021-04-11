import moment from 'moment';
import React from 'react';
import { Col, Container, Card, Row, Carousel } from 'react-bootstrap';
import { Marker, Polyline } from 'react-google-maps';

import api from '~api/main';
import { Trip } from 'types/trips';
import { Map, ValueLabel } from '~components';
import ExpensePanel from '../expenses/ExpensePanel';
import RideModal from './ride-modal';
import { RideBinding } from '~types/ride';

interface State {
    beerSum: number;
    expenseFilters: any;
    isRideModalOpen: boolean;
    ride: RideBinding;
    trackings: any[];
    trip: Trip;
}

class TripDetailsPage extends React.Component<{}, State> {

    state: State = {
        beerSum: 0,
        expenseFilters: {
            page: 1,
            pageSize: 10,
        },
        isRideModalOpen: true,
        ride: {
            typeId: 'car'
        },
        trip: {
            cities: [],
            countries: [],
            expenses: [],
            id: '',
        },
        trackings: [],
    };

    componentDidMount() {
        api.trip.getById(props.match.params.id)
            .then(trip => {
                this.setState({ trip });
                const filters = { from: trip.timestampStart, to: trip.timestampEnd };
                api.tracking.get(filters).then(trackings => this.setState({ trackings }));
                api.consumation.getSum(filters).then(beerSum => this.setState({ beerSum }));
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
                                        <ValueLabel label="Days" value={days} />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel label="Distance" unit="km" value={Number(trip.distance / 1000)} />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel label="Spent" unit="kn" value={Number(trip.totalSpent)} />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel label="Cities" value={trip.cities.length} />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel label="Countries" value={trip.countries.length} />
                                    </Col>
                                    <Col lg={2} md={3} sm={6} xs={12}>
                                        <ValueLabel label="Beer" unit="L" value={Math.ceil(beerSum / 1000)} />
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
                                <Map>
                                    {poiMarkers}
                                    <Polyline path={trackings} />
                                </Map>
                            </Card.Body>
                        </Card>
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
                <RideModal
                    isOpen={this.state.isRideModalOpen}
                    onChange={this.onRideChange}
                    onClose={() => this.setState({ isRideModalOpen: false })}
                    onSave={this.onRideSave}
                />
            </Container>
        );
    }

    onExpensePageChange = (page) => {
        this.setState({
            expenseFilters: {
                ...this.state.expenseFilters,
                page,
            },
        });
    }

    onRideChange = (changed: Partial<RideBinding>) => {
        this.setState({
            ride: {
                ...this.state.ride,
                ...changed,
            }
        });
    }

    onRideSave = () => {
        api.ride.post(this.state.ride);
    }

    onUnlink = (expenseId) => {
        api.trip
            .deleteExpense(this.state.trip.id, expenseId)
            .then(() => { });
    }
}

export default TripDetailsPage;
