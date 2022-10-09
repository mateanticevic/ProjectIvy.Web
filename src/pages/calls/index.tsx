import React from 'react';
import { Col, FormLabel, FormControl, FormGroup, Container, Card, Row, Table } from 'react-bootstrap';
import moment from 'moment';

import api from 'api/main';
import { DateFormElement, Pagination } from 'components';
import { Page } from 'pages/Page';
import { Call } from 'types/calls';
import * as formatHelper from 'utils/format-helper';

interface State {
    calls: {
        count: number,
        items: Call[],
    };
    filters: {
        page: number,
        pageSize: number,
    };
}

export default class CallsPage extends Page<{}, State> {

    state: State = {
        calls: {
            count: 0,
            items: [],
        },
        filters: {
            page: 1,
            pageSize: 10,
        },
    };

    componentDidMount() {
        this.onFiltersChange();
    }

    render() {
        const { calls, filters } = this.state;

        const pages = Math.ceil(calls.count / filters.pageSize);

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <DateFormElement
                                    label="From"
                                    onChange={date => this.onFiltersChange({ from: date })}
                                    value={filters.from}
                                />
                                <DateFormElement
                                    label="To"
                                    onChange={date => this.onFiltersChange({ to: date })}
                                    value={filters.to}
                                />
                                <FormGroup>
                                    <FormLabel>Number</FormLabel>
                                    <FormControl
                                        value={filters.number}
                                        type="text"
                                        onChange={x => this.onFiltersChange({ number: x.target.value })}
                                    />
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Calls ({calls.count})</Card.Header>
                            <Card.Body>
                                <Table responsive>
                                    <tbody>
                                        {this.renderCalls()}
                                    </tbody>
                                </Table>
                                <Pagination
                                    page={filters.page}
                                    pages={pages}
                                    onPageChange={page => this.onFiltersChange({ page })}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>);
    }

    fetchCalls = () => {
        api.call
            .get(this.state.filters)
            .then(calls => this.setState({ calls }));
    }

    onFiltersChange = (changedFilters?) => {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);

        this.setState({ filters }, this.fetchCalls);
    }

    renderCalls = () => {
        return this.state.calls.items.map(call => (<tr>
            <td>{moment(call.timestamp).format('Do MMMM YYYY HH:mm:ss')}</td>
            <td>{call.person ? `${call.person.firstName} ${call.person.lastName}` : call.number}</td>
            <td><a href={`/api/file/${call.file.id}`}>{formatHelper.time(call.duration)}</a></td>
            <td>
                <audio preload="none" controls src={`/api/file/${call.file.id}`} />
            </td>
        </tr>
        ));
    }
}
