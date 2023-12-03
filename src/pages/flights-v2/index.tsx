import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import api from 'api/main';
import { Page } from 'pages/page';
import FlightItem from './flight-item';
import { components } from 'types/ivy-types';
import FlightModal from './flight-modal';

type Flight = components['schemas']['Flight'];
type FlightBinding = components['schemas']['FlightBinding'];

interface Filter {
    page: number,
    pageSize: number,
}

interface State {
    count: number,
    filter: Filter,
    flight: Flight,
    flightBinding: FlightBinding,
    flights: Flight[],
    isModalOpen: boolean,
}

class FlightsV2Page extends Page<unknown, State> {

    state: State = {
        count: 0,
        filter: {
            page: 1,
            pageSize: 200,
        },
        flight: {},
        flightBinding: {},
        flights: [],
        isModalOpen: false,
    };

    componentDidMount() {
        this.onFilterChanged();
    }

    render() {
        const { count, filter, flight, flightBinding, flights, isModalOpen } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={3}>ok</Col>
                    <Col lg={9}>
                        <InfiniteScroll
                            dataLength={count}
                            next={this.getNextsPage}
                            hasMore={filter.page * filter.pageSize < count}
                            loader={<h4>Loading...</h4>}
                            endMessage="no more"

                        >
                            {flights.map(flight =>
                                <FlightItem
                                    key={flight.departure}
                                    flight={flight}
                                    onClick={() => this.onFlightClick(flight)}
                                />
                            )}
                        </InfiniteScroll>
                    </Col>
                </Row>
                <FlightModal
                    flight={flight}
                    flightBinding={flightBinding}
                    isOpen={isModalOpen}
                    onChange={this.onFlightChanged}
                    onClose={() => this.setState({ isModalOpen: false })}
                    onSave={this.onFlightSave}
                />
            </Container>
        );
    }

    getNextPage = () => {
        this.onFilterChanged({
            page: this.state.filter.page + 1,
        });
    };

    onFlightClick = (flight: Flight) => {
        this.setState({
            flight,
            flightBinding: {
                airlineId: flight.airline?.id,
                arrival: flight.arrival,
                arrivalLocal: flight.arrivalLocal,
                departure: flight.departure,
                departureLocal: flight.departureLocal,
                number: flight.number,
                originId: flight.origin?.iata,
                destinationId: flight.destination?.iata,
            }
        }, () => this.setState({ isModalOpen: true }));
    };

    onFlightChanged = (changed: Partial<Flight>) => {
        this.setState({
            flightBinding: {
                ...this.state.flightBinding,
                ...changed,
            }
        });
    };

    onFlightSave = () => {
        api.flight.put(this.state.flight.id, this.state.flightBinding)
            .then(() => this.setState({ isModalOpen: false }));
    };

    onFilterChanged = (changedFilters?: Partial<Filter>) => {
        const filter = {
            ...this.state.filter,
            ...changedFilters,
        };
        this.setState({ filter });

        api.flight.get(filter)
            .then(result => this.setState({
                count: result.count,
                flights: this.state.flights.concat(result.items),
            }));
    };
}

export default FlightsV2Page;
