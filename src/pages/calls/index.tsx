import React from "react";
import { Grid, Col, Panel, Table } from "react-bootstrap";

import * as callApi from "../../api/main/call";
import { boundMethod } from "autobind-decorator";
import Moment from "react-moment";

export default class CallsPage extends React.Component {

    state = {
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
            <td>{call.number}</td>
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
                    <Col lg={12}>
                        <Panel>
                            <Panel.Heading>Calls ({calls.count})</Panel.Heading>
                            <Panel.Body>
                                <Table>
                                    <tbody>
                                        {this.renderCalls()}
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Grid>);
        }
}