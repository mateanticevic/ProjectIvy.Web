import _ from 'lodash';
import React from 'react';
import { Col, Container, Badge, ListGroup, ListGroupItem, Card, Row, Button, FormGroup, FormLabel, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import api from 'api/main';
import { Page } from 'pages/page';
import { Flight } from 'types/flights';
import FlightItem from './flight-item';

interface Filter {
    page: number,
    pageSize: number,
}


interface State {
    count: number,
    filter: Filter,
    flights: Flight[],
}

class FlightsV2Page extends Page<{}, State> {

    state: State = {
        count: 0,
        filter: {
            page: 1,
            pageSize: 140,
        },
        flights: []
    };

    componentDidMount() {
        this.onFilterChanged();
    }

    render() {
        const { count, filter, flights } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={3}>ok</Col>
                    <Col lg={9}>
                        <InfiniteScroll
                            dataLength={count}
                            next={this.getNextPage}
                            hasMore={filter.page * filter.pageSize < count}
                            loader={<h4>Loading...</h4>}
                            endMessage="no more"

                        >
                            {flights.map(flight =>
                                <FlightItem
                                    key={flight.departure}
                                    flight={flight}
                                />
                            )}
                        </InfiniteScroll>
                    </Col>
                </Row>
            </Container>
        );
    }

    getNextPage = () => {
        this.onFilterChanged({
            page: this.state.filter.page + 1,
        });
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
