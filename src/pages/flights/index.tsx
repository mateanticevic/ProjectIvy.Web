import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import api from 'api/main';
import moment from 'moment';
import AsyncSelect from 'react-select/async';
import { airportLoader } from 'utils/select-loaders';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';
import FlightItem from './flight-item';
import { components, paths } from 'types/ivy-types';
import FlightModal from './flight-modal';
import { DistributionCard, SmartScroll } from 'components';
import { RiPlayListAddLine } from 'react-icons/ri';

type Flight = components['schemas']['Flight'];
type FlightBinding = components['schemas']['FlightBinding'];

type FlightQuery = NonNullable<paths['/Flight']['get']['parameters']['query']>;
type FlightFilters = Pick<FlightQuery, 'OriginId' | 'DestinationId' | 'From' | 'To'>;
type AirportOption = { value: string; label: string };

const PAGE_SIZE = 10;

enum CountByFlights {
    Airline,
    Airport,
}

const countByOptions = [
    { value: CountByFlights.Airline, name: 'Airline' },
    { value: CountByFlights.Airport, name: 'Airport' },
];

const countApiMapping = {
    [CountByFlights.Airline]: api.flight.getCountByAirline,
    [CountByFlights.Airport]: api.flight.getCountByAirport,
};

const FlightsPage: React.FC = () => {
    const [count, setCount] = useState(0);
    const [countBy, setCountBy] = useState(CountByFlights.Airline);
    const [countByData, setCountByData] = useState<unknown[] | null>(null);
    const [countByYearData, setCountByYearData] = useState<unknown[] | null>(null);
    const [yearCountError, setYearCountError] = useState(false);
    const [draftOrigin, setDraftOrigin] = useState<AirportOption | null>(null);
    const [draftDestination, setDraftDestination] = useState<AirportOption | null>(null);
    const [draftFrom, setDraftFrom] = useState('');
    const [draftTo, setDraftTo] = useState('');
    const [draftAscending, setDraftAscending] = useState(false);
    const [filters, setFilters] = useState<FlightFilters>({});
    const [orderAscending, setOrderAscending] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [listError, setListError] = useState(false);
    const [topCountError, setTopCountError] = useState(false);
    const [flight, setFlight] = useState<Flight>({} as Flight);
    const [flightBinding, setFlightBinding] = useState<FlightBinding>({} as FlightBinding);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const reactSelectStyles = useReactSelectStyles<AirportOption>();

    useEffect(() => {
        let cancelled = false;
        api.flight.get({ ...filters, OrderAscending: orderAscending, Page: page, PageSize: PAGE_SIZE })
            .then(result => {
                if (cancelled) return;
                setCount(result.count);
                setFlights(previous => page === 1 ? result.items : previous.concat(result.items));
            })
            .catch(() => {
                if (!cancelled) setListError(true);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => { cancelled = true; };
    }, [filters, orderAscending, page]);

    useEffect(() => {
        let cancelled = false;
        setTopCountError(false);
        setCountByData(null);
        countApiMapping[countBy]({ ...filters, PageAll: true })
            .then(data => {
                if (!cancelled) setCountByData(data.slice(0, 10));
            })
            .catch(() => {
                if (!cancelled) setTopCountError(true);
            });
        return () => { cancelled = true; };
    }, [countBy, filters]);

    useEffect(() => {
        let cancelled = false;
        setYearCountError(false);
        setCountByYearData(null);
        api.flight.getCountByYear({ ...filters, PageAll: true })
            .then(data => {
                if (!cancelled) setCountByYearData([...data].reverse());
            })
            .catch(() => {
                if (!cancelled) setYearCountError(true);
            });
        return () => { cancelled = true; };
    }, [filters]);

    const applyFilters = (nextFilters: FlightFilters, ascending: boolean) => {
        setFlights([]);
        setCount(0);
        setPage(1);
        setListError(false);
        setIsLoading(true);
        setFilters(nextFilters);
        setOrderAscending(ascending);
    };

    const onFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextFilters: FlightFilters = {};
        if (draftOrigin) nextFilters.OriginId = draftOrigin.value;
        if (draftDestination) nextFilters.DestinationId = draftDestination.value;
        if (draftFrom) nextFilters.From = draftFrom;
        // The flight API uses a day boundary for the end of the range.
        if (draftTo) nextFilters.To = moment(draftTo).add(1, 'day').format('YYYY-MM-DD');
        applyFilters(nextFilters, draftAscending);
    };

    const clearFilters = () => {
        setDraftOrigin(null);
        setDraftDestination(null);
        setDraftFrom('');
        setDraftTo('');
        setDraftAscending(false);
        applyFilters({}, false);
    };

    const getNextPage = () => {
        if (isLoading || listError) return;
        setIsLoading(true);
        setPage(previous => previous + 1);
    };

    const onFlightClick = (flight: Flight) => {
        setFlight(flight);
        setFlightBinding({
            airlineId: flight.airline?.id,
            arrival: flight.arrival,
            arrivalLocal: flight.arrivalLocal,
            departure: flight.departure,
            departureLocal: flight.departureLocal,
            number: flight.number,
            originId: flight.origin?.iata,
            destinationId: flight.destination?.iata,
        });
        setIsModalOpen(true);
    };

    const onFlightChanged = (changed: Partial<Flight>) => {
        setFlightBinding(prevBinding => ({ ...prevBinding, ...changed }));
    };

    const onFlightSave = () => {
        if (flight.id) {
            api.flight.put(flight.id, flightBinding)
                .then(() => setIsModalOpen(false));
        } else {
            api.flight.post(flightBinding)
                .then(() => setIsModalOpen(false));
        }
    };

    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <Card>
                        <Card.Body>
                            <Button className="w-100 mb-3" onClick={() => setIsModalOpen(true)}>
                                <RiPlayListAddLine /> New flight
                            </Button>
                            <Form onSubmit={onFilterSubmit}>
                                <Form.Group controlId="flight-filter-origin" className="mb-2">
                                    <Form.Label>Origin</Form.Label>
                                    <AsyncSelect<AirportOption>
                                        inputId="flight-filter-origin"
                                        isClearable
                                        loadOptions={airportLoader}
                                        onChange={setDraftOrigin}
                                        styles={reactSelectStyles}
                                        value={draftOrigin}
                                    />
                                </Form.Group>
                                <Form.Group controlId="flight-filter-destination" className="mb-2">
                                    <Form.Label>Destination</Form.Label>
                                    <AsyncSelect<AirportOption>
                                        inputId="flight-filter-destination"
                                        isClearable
                                        loadOptions={airportLoader}
                                        onChange={setDraftDestination}
                                        styles={reactSelectStyles}
                                        value={draftDestination}
                                    />
                                </Form.Group>
                                <Form.Group controlId="flight-filter-from" className="mb-2">
                                    <Form.Label>From date</Form.Label>
                                    <Form.Control type="date" value={draftFrom} max={draftTo || undefined}
                                        onChange={event => setDraftFrom(event.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="flight-filter-to" className="mb-2">
                                    <Form.Label>Through date</Form.Label>
                                    <Form.Control type="date" value={draftTo} min={draftFrom || undefined}
                                        onChange={event => setDraftTo(event.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="flight-filter-order" className="mb-3">
                                    <Form.Label>Sort by departure</Form.Label>
                                    <Form.Select value={String(draftAscending)}
                                        onChange={event => setDraftAscending(event.target.value === 'true')}>
                                        <option value="false">Newest first</option>
                                        <option value="true">Oldest first</option>
                                    </Form.Select>
                                </Form.Group>
                                <div className="d-flex flex-wrap gap-2">
                                    <Button type="submit">Apply filters</Button>
                                    <Button type="button" variant="outline-secondary" onClick={clearFilters}>Clear</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <SmartScroll
                        dataLength={flights.length}
                        hasMore={!listError && flights.length < count}
                        isLoading={isLoading}
                        onLoadMore={getNextPage}
                    >
                        {flights.map(flight =>
                            <FlightItem
                                key={flight.id ?? flight.departure}
                                flight={flight}
                                onClick={() => onFlightClick(flight)}
                            />
                        )}
                    </SmartScroll>
                    {isLoading && page === 1 && <p role="status">Loading flights…</p>}
                    {listError && <p role="alert">Could not load flights.</p>}
                    {!isLoading && !listError && count === 0 && <p>No flights found.</p>}
                </Col>
                <Col lg={3}>
                    <DistributionCard
                        countByOptions={countByOptions}
                        data={topCountError ? [] : countByData}
                        name="Top 10"
                        onGroupByChange={setCountBy}
                    />
                    {topCountError && <p role="alert">Could not load the top 10 flights chart.</p>}
                    {yearCountError ? (
                        <Card>
                            <Card.Header>Flights per year</Card.Header>
                            <Card.Body role="alert">Could not load flights per year.</Card.Body>
                        </Card>
                    ) : (
                        <DistributionCard
                            data={countByYearData}
                            name="Flights per year"
                        />
                    )}
                </Col>
            </Row>
            <FlightModal
                flight={flight}
                flightBinding={flightBinding}
                isOpen={isModalOpen}
                onChange={onFlightChanged}
                onClose={() => setIsModalOpen(false)}
                onSave={onFlightSave}
            />
        </Container>
    );
};

export default FlightsPage;
