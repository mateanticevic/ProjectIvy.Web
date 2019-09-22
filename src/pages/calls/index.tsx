import React from "react";
import { Grid, Col, Panel, Table, Row } from "react-bootstrap/lib";

import api from "../../api/main";
import { boundMethod } from "autobind-decorator";
import Moment from "react-moment";
import { Call } from "types/calls";
import { Pagination } from '../../components'
import * as formatHelper from '../../utils/formatHelper';

type State = {
    calls: {
        count: number,
        items: Call[]
    },
    filters: {
        page: number,
        pageSize: number
    }
}

export default class CallsPage extends React.Component {

    state: State = {
        calls: {
            count: 0,
            items: []
        },
        filters: {
            page: 1,
            pageSize: 10
        }
    }

    componentDidMount() {
        this.fetchCalls();
    }

    fetchCalls() {
        api.call.get(this.state.filters).then(calls => this.setState({ calls }));
    }

    @boundMethod
    onFiltersChange(keyValue) {
        this.setState({
            filters: {
                ...this.state.filters,
                ...keyValue
            }
        }, this.fetchCalls);
    }

    @boundMethod
    renderCalls() {

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

    render() {

        const { calls, filters } = this.state;

        const pages = Math.ceil(calls.count / filters.pageSize);

        return (
            <Grid>
                <Row>
                    <Col lg={12}>
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
                                    onPageChange={page => this.onFiltersChange({ page })}
                                />
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>);
    }
}