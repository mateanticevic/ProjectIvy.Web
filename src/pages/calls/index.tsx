import { boundMethod } from 'autobind-decorator';
import React from 'react';
import { Col, FormLabel, FormControl, FormGroup, Container, Panel, Row, Table } from 'react-bootstrap';
import Moment from 'react-moment';

import { Call } from 'types/calls';
import api from '../../api/main';
import { Pagination } from '../../components';
import { DateFormElement } from '../../components';
import * as formatHelper from '../../utils/formatHelper';
import { Page } from '../Page';

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

    private fetchCalls() {
        api.call
            .get(this.state.filters)
            .then(calls => this.setState({ calls }));
    }

    @boundMethod
    private onFiltersChange(changedFilters?) {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);

        this.setState({ filters }, this.fetchCalls);
    }

    @boundMethod
    private renderCalls() {

        return this.state.calls.items.map(call => (<tr>
            <td><Moment format="Do MMMM YYYY HH:mm:ss">{call.timestamp}</Moment></td>
            <td>{call.person ? `${call.person.firstName} ${call.person.lastName}` : call.number}</td>
            <td>{formatHelper.time(call.duration)}</td>
            <td>
                <audio controls src={`https://api2.anticevic.net/file/${call.file.id}`} />
            </td>
        </tr>
        ));
    }
}
