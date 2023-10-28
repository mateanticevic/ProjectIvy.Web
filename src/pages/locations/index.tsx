import React from 'react';
import { Card, Col, Container, FormGroup, FormLabel, Row, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { GoogleMap, InfoWindow, Marker, Polyline, Rectangle } from 'react-google-maps';
import geohash from 'ngeohash';

import { Page } from 'pages/page';
import { DateFormElement, Map, Select } from 'components';
import { components } from 'types/ivy-types';
import api from 'api/main';
import _ from 'lodash';
import CalendarGrid from 'components/calendar-grid';

type Location = components['schemas']['Location'];

interface State {
    locations: Location[],
    selectedLocation?: Location,
    selectedLocationDays?: string[],
}

class LocationsPage extends Page<unknown, State> {

    map: GoogleMap;

    state: State = {
        locations: [],
    };

    componentDidMount() {
        api.location.get()
            .then(locations => this.setState({ locations }));
    }

    render() {

        const { locations, selectedLocation, selectedLocationDays } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={8}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map refSet={mapRef => this.map = mapRef}>
                                    {locations.flatMap(l => l.geohashes).map(g => {
                                        const rectangle = geohash.decode_bbox(g);

                                        return (
                                            <Rectangle
                                                key={_.uniqueId()}
                                                bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
                                            />
                                        );
                                    })}
                                </Map>
                            </Card.Body>
                        </Card>
                        {selectedLocation &&
                            <Card>
                                <Card.Header>Selected</Card.Header>
                                <Card.Body>
                                    {selectedLocationDays &&
                                        <CalendarGrid dates={selectedLocationDays} />
                                    }
                                </Card.Body>
                            </Card>
                        }
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Header>Locations</Card.Header>
                            <Card.Body>
                                <Table responsive>
                                    <tbody>
                                        {locations.map(location =>
                                            <tr onClick={() => this.onLocationSelect(location)}><td>{location.name}</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    onLocationSelect = (location: Location) => {
        api.location.getDays(location.id)
            .then(selectedLocationDays => {
                this.setState({
                    selectedLocation: location,
                    selectedLocationDays,
                });
            });
    }
}

export default LocationsPage;