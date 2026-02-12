import moment from 'moment';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Col, Container, Card, Row, Carousel, Badge } from 'react-bootstrap';
import { Marker, Polyline } from '@react-google-maps/api';
import './styles.scss';
import AsyncSelect from 'react-select/async';
import { useParams } from 'react-router';

import api from 'api/main';
import { Map, ValueLabel } from 'components';
import { StayItem } from 'components/stay-item';
import ExpensePanel from '../expenses/expense-panel';
import { Ride, RideBinding } from 'types/ride';
import Timeline from './timeline';
import StayModal from '../trips/stay-modal';
import { cityLoader, expenseLoader } from 'utils/select-loaders';
import { UserContext } from 'contexts/user-context';
import { components } from 'types/ivy-types';
import { User } from 'types/users';
import { iconUrl } from 'utils/cdn-helper';
import { getReactSelectStyles, isDarkTheme } from 'utils/react-select-dark-theme';
import { PagingFilters } from 'types/paging';

type Flight = components['schemas']['Flight'];
type Trip = components['schemas']['Trip'];
type Stay = components['schemas']['Stay'];
type Tracking = components['schemas']['Tracking'];

const TripDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useContext(UserContext) as User;
    const mapRef = useRef<google.maps.Map | undefined>(undefined);
    const reactSelectStyles = getReactSelectStyles(isDarkTheme());

    const [beerSum, setBeerSum] = useState<number>(0);
    const [expenseFilters, setExpenseFilters] = useState<PagingFilters>({
        page: 1,
        pageSize: 10,
    });
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isRideModalOpen, setIsRideModalOpen] = useState<boolean>(true);
    const [isStayModalOpen, setIsStayModalOpen] = useState<boolean>(false);
    const [ride, setRide] = useState<RideBinding>({
        typeId: 'car'
    });
    const [rides, setRides] = useState<Ride[]>([]);
    const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
    const [stays, setStays] = useState<Stay[]>([]);
    const [trip, setTrip] = useState<Trip>({
        cities: [],
        countries: [],
        expenses: [],
        id: '',
        stays: [],
    });
    const [trackings, setTrackings] = useState<Tracking[]>([]);

    useEffect(() => {
        if (!id) return;

        api.trip.getById(id)
            .then(trip => {
                setTrip(trip);
                const filters = { from: trip.timestampStart, to: trip.timestampEnd };
                api.consumation.getSum(filters).then(beerSum => setBeerSum(beerSum));
                api.flight.get(filters).then(flights => setFlights(flights.items));
                api.ride.get(filters).then(rides => setRides(rides));
                api.tracking.get(filters).then(trackings => {
                    setTrackings(trackings);
                    const bounds = new google.maps.LatLngBounds();
                    trackings.forEach(tracking => bounds.extend(tracking));
                    mapRef.current?.fitBounds(bounds);
                });
            });
    }, [id]);

    const addCity = (cityId: string) => {
        api.trip.postCity(trip.id!, cityId);
    };

    const addExpense = (expenseId: string) => {
        api.trip.postExpense(trip.id!, expenseId);
    };

    const deleteCity = (cityId: string) => {
        api.trip.deleteCity(trip.id!, cityId);
    };

    const onExpensePageChange = (page: number) => {
        setExpenseFilters({
            ...expenseFilters,
            page,
        });
    };

    const onRideChange = (changed: Partial<RideBinding>) => {
        setRide({
            ...ride,
            ...changed,
        });
    };

    const onRideSave = () => {
        api.ride.post(ride);
    };

    const onUnlink = (expenseId: string) => {
        api.trip
            .deleteExpense(trip.id, expenseId)
            .then(() => { });
    };

    const onEditStay = (stay: Stay) => {
        setSelectedStay(stay);
        setIsStayModalOpen(true);
    };

    const onStayChange = (changed: Partial<Stay>) => {
        setSelectedStay({
            ...selectedStay,
            ...changed,
        } as Stay);
    };

    const onStaySave = () => {
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
                    setTrip(updatedTrip);
                    setIsStayModalOpen(false);
                    setSelectedStay(null);
                });
            });
    };

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
                                        unit={user.defaultCurrency.symbol}
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
                            <Map onLoad={map => mapRef.current = map}>
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
                        <Badge onClick={() => deleteCity(city.id)}>{city.name}</Badge>
                    )}
                    <AsyncSelect
                        loadOptions={cityLoader}
                        onChange={(city: any) => addCity(city.value)}
                        defaultOptions
                        styles={reactSelectStyles}
                    />
                    <AsyncSelect
                        loadOptions={expenseLoader}
                        onChange={(expense: any) => addExpense(expense.value)}
                        defaultOptions
                        styles={reactSelectStyles}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <ExpensePanel
                        expenses={{ items: trip.expenses, count: trip.expenses.length }}
                        page={expenseFilters.page}
                        pageSize={expenseFilters.pageSize}
                        onPageChange={onExpensePageChange}
                        onUnlink={onUnlink} />
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
                                        <StayItem
                                            key={stay.id || index}
                                            stay={stay}
                                            onEdit={onEditStay}
                                        />
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
                        flights={flights}
                        rides={rides}
                        to={moment(trip.timestampEnd)}
                    />
                </Col>
            </Row>
            <StayModal
                buttonIsLoading={false}
                isOpen={isStayModalOpen}
                stay={selectedStay}
                onClose={() => {
                    setIsStayModalOpen(false);
                    setSelectedStay(null);
                }}
                onChange={onStayChange}
                onSave={onStaySave}
                countries={trip.countries || []}
            />
            {/* <RideModal
                isOpen={isRideModalOpen}
                onChange={onRideChange}
                onClose={() => setIsRideModalOpen(false)}
                onSave={onRideSave}
            /> */}
        </Container>
    );
};

export default TripDetailsPage;
