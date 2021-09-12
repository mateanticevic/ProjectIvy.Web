import React from 'react';
import { Card, Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import { Page } from 'pages/Page';
import { Map } from 'components';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { GoogleMap } from 'react-google-maps';
import { MdToday } from 'react-icons/md';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Ri24HoursFill } from 'react-icons/ri';

type Tracking = components['schemas']['Tracking'];

interface State {
    dateMode: DateMode,
    last?: Tracking
}

enum DateMode {
    Day,
    Range,
    Last
}

class LocationPage extends Page<{}, State> {

    map: GoogleMap;

    state: State = {
        dateMode: DateMode.Day
    }

    componentDidMount() {
        api.tracking.getLastLocation()
            .then(response => this.setState({ last: response.tracking }));
    }

    render() {

        const { dateMode, last } = this.state;

        const isMapReady = !!last;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Draw</Card.Header>
                            <Card.Body>
                                <ToggleButtonGroup type="radio" name="options" value={dateMode} onChange={dateMode => this.setState({dateMode})}>
                                    <ToggleButton value={DateMode.Day}><MdToday /> Day</ToggleButton>
                                    <ToggleButton value={DateMode.Range}><FaRegCalendarAlt /> Range</ToggleButton>
                                    <ToggleButton value={DateMode.Last}><Ri24HoursFill /> Last</ToggleButton>
                                </ToggleButtonGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                {isMapReady &&
                                    <Map
                                        defaultZoom={13}
                                        defaultCenter={{ lat: last.latitude, lng: last.longitude }}
                                        refSet={mapRef => this.map = mapRef}
                                    >
                                    </Map>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default LocationPage;