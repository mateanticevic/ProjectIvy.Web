import React, { useState, useEffect, useCallback } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from 'api/main';
import FlightItem from './flight-item';
import { components } from 'types/ivy-types';
import FlightModal from './flight-modal';
import { DistributionCard } from 'components';

type Flight = components['schemas']['Flight'];
type FlightBinding = components['schemas']['FlightBinding'];

interface Filter {
    page: number;
    pageSize: number;
}

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

const FlightsV2Page: React.FC = () => {
    const [count, setCount] = useState(0);
    const [countBy, setCountBy] = useState(CountByFlights.Airline);
    const [countByData, setCountByData] = useState<any>([]);
    const [filter, setFilter] = useState<Filter>({ page: 1, pageSize: 200 });
    const [flight, setFlight] = useState<Flight>({} as Flight);
    const [flightBinding, setFlightBinding] = useState<FlightBinding>({} as FlightBinding);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = () => {
        api.flight.get(filter)
            .then(result => {
                setCount(result.count);
                setFlights(prevFlights => prevFlights.concat(result.items));
            });

        countApiMapping[countBy](filter)
            .then(data => setCountByData(data.slice(0, 10)));
    };

    const getNextPage = () => {
        setFilter(prevFilter => ({ ...prevFilter, page: prevFilter.page + 1 }));
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

    const onCountByChange = useCallback((newCountBy?: CountByFlights) => {
        if (newCountBy !== undefined) {
            setCountBy(newCountBy);
        }

        countApiMapping[newCountBy ?? countBy](filter)
            .then(data => setCountByData(data.slice(0, 10)));
    }, [countBy, filter]);

    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <Button onClick={() => setIsModalOpen(true)}>
                        New
                    </Button>
                </Col>
                <Col lg={6}>
                    <InfiniteScroll
                        dataLength={count}
                        next={getNextPage}
                        hasMore={filter.page * filter.pageSize < count}
                        loader={<h4>Loading...</h4>}
                        endMessage="no more"
                    >
                        {flights.map(flight =>
                            <FlightItem
                                key={flight.departure}
                                flight={flight}
                                onClick={() => onFlightClick(flight)}
                            />
                        )}
                    </InfiniteScroll>
                </Col>
                <Col lg={3}>
                    <DistributionCard
                        countByOptions={countByOptions}
                        data={countByData}
                        name="Top 10"
                        onGroupByChange={onCountByChange}
                    />
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

export default FlightsV2Page;
