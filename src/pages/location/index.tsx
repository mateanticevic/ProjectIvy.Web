import React from 'react';
import { Button, Card, Col, Container, FormGroup, FormLabel, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import { Page } from 'pages/Page';
import { DateFormElement, Map, Select } from 'components';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { GoogleMap, Polyline } from 'react-google-maps';
import { MdToday } from 'react-icons/md';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Ri24HoursFill } from 'react-icons/ri';
import ButtonWithSpinner from 'components/ButtonWithSpinner';
import { Layer } from 'types/location';
import moment from 'moment';
import _ from 'lodash';
import { trackingToLatLng } from 'utils/gmap-helper';

type Tracking = components['schemas']['Tracking'];

interface State {
    dateMode: DateMode,
    filterDay?: string,
    last?: Tracking,
    lastNDays: LastNDays,
    layers: Layer[],
    requestActive: boolean,
}

enum DateMode {
    Day,
    Range,
    Last
}

enum LastNDays {
    One = 'one',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

const lastNDaysOptions = [
    { id: LastNDays.One, name: '24 hours' },
    { id: LastNDays.Week, name: 'Week' },
    { id: LastNDays.Month, name: 'Month' },
    { id: LastNDays.Year, name: 'Year' },
];

class LocationPage extends Page<{}, State> {

    map: GoogleMap;

    state: State = {
        dateMode: DateMode.Day,
        lastNDays: LastNDays.One,
        layers: [],
        requestActive: false,
    }

    componentDidMount() {
        api.tracking.getLastLocation()
            .then(response => this.setState({ last: response.tracking }));
    }

    render() {

        const { dateMode, last, layers, requestActive } = this.state;

        const isMapReady = !!last;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Draw</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <ToggleButtonGroup type="radio" name="options" value={dateMode} onChange={dateMode => this.setState({ dateMode })}>
                                        <ToggleButton value={DateMode.Day}><MdToday /> Day</ToggleButton>
                                        <ToggleButton value={DateMode.Range}><FaRegCalendarAlt /> Range</ToggleButton>
                                        <ToggleButton value={DateMode.Last}><Ri24HoursFill /> Last</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                {dateMode == DateMode.Day &&
                                    <DateFormElement onChange={filterDay => this.setState({ filterDay })} />
                                }
                                {dateMode == DateMode.Last &&
                                    <FormGroup>
                                        <Select
                                            options={lastNDaysOptions}
                                            onChange={lastNDays => this.setState({ lastNDays })}
                                        />
                                    </FormGroup>
                                }
                                <ButtonWithSpinner
                                    isLoading={requestActive}
                                    onClick={this.draw}
                                >
                                    Draw
                                </ButtonWithSpinner>
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
                                        {layers.map(layer =>
                                            <Polyline
                                                key={layer.id}
                                                path={layer.path}
                                            />
                                        )}
                                    </Map>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    draw = () => {
        this.setState({ requestActive: true });
        const nextDay = moment(this.state.filterDay).add(1, 'days').format('YYYY-MM-DD');
        const filters = { from: this.state.filterDay, to: nextDay };
        api.tracking.get(filters).then(trackings => {
            api.tracking.getDistance(filters).then(distance => {
                const layer: Layer = {
                    id: _.uniqueId(),
                    path: trackingToLatLng(trackings),
                };
                this.setState({
                    layers: [
                        ...this.state.layers,
                        layer,
                    ],
                    requestActive: false,
                });
            });
        });
    }
}

export default LocationPage;