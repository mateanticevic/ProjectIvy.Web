import React from 'react';
import { Col, Grid, Panel, Row, Table } from 'react-bootstrap/lib';

import { boundMethod } from 'autobind-decorator';
import Moment from 'react-moment';
import { Call } from 'types/calls';
import api from '../../api/main';
import { Pagination } from '../../components';
import * as formatHelper from '../../utils/formatHelper';
import { DateFormElement } from '../../components';
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

    public state: State = {
        calls: {
            count: 0,
            items: [],
        },
        filters: {
            page: 1,
            pageSize: 10,
        },
    };

    public componentDidMount() {
        this.fetchCalls();
    }

    public fetchCalls() {
        api.call.get(this.state.filters).then((calls) => this.setState({ calls }));
    }

    @boundMethod
    public onFiltersChange(changedFilters) {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);

        this.setState({ filters }, this.fetchCalls);
    }

    @boundMethod
    public renderCalls() {

        return this.state.calls.items.map((call) => (<tr>
            <td><Moment format="Do MMMM YYYY HH:mm:ss">{call.timestamp}</Moment></td>
            <td>{call.person ? `${call.person.firstName} ${call.person.lastName}` : call.number}</td>
            <td>{formatHelper.time(call.duration)}</td>
            <td>
                <audio controls src={`https://api2.anticevic.net/file/${call.file.id}`} />
            </td>
        </tr>
        ));
    }

    public render() {

        const { calls, filters } = this.state;

        const pages = Math.ceil(calls.count / filters.pageSize);

        return (
            <Grid>
                <Row>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Filters</Panel.Heading>
                            <Panel.Body>
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
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col lg={9}>
                        <Panel>
                            <Panel.Heading>Calls ({calls.count})</Panel.Heading>
                            <Panel.Body>
                                <Table responsive>
                                    <tbody>
                                        {this.renderCalls()}
                                    </tbody>
                                </Table>
                                <Pagination
                                    page={filters.page}
                                    pages={pages}
                                    onPageChange={(page) => this.onFiltersChange({ page })}
                                />
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>);
    }
}
