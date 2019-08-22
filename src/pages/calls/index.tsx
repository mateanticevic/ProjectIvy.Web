import React from "react";
import { Grid, Col, Panel, Table, Row } from "react-bootstrap/lib";

import * as callApi from "../../api/main/call";
import { boundMethod } from "autobind-decorator";
import Moment from "react-moment";
import { Call } from "types/calls";

type State = {
    calls : {
        count: number,
        items: Call[]
    }
}

export default class CallsPage extends React.Component {

    state: State = {
        calls: {
            count: 0,
            items: []
        }
    }

    componentDidMount() {
        callApi.getCalls().then(calls => this.setState({ calls }));
    }

    @boundMethod
    renderCalls() {

        return this.state.calls.items.map(call => (<tr>
            <td><Moment format="Do MMMM YYYY HH:mm:ss">{call.timestamp}</Moment></td>
            <td>{call.person ? `${call.person.firstName} ${call.person.lastName}` : call.number}</td>
            <td>{call.duration}s</td>
            <td>
                <audio controls src={`https://api2.anticevic.net/file/${call.file.id}`} />
            </td>
        </tr>
        ));
    }

    render() {

        const { calls } = this.state;

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
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>);
    }
}