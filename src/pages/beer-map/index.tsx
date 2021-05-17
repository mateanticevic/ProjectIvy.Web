import React from 'react';
import { Col, Container, Card, Row } from 'react-bootstrap';

import api from 'api/main';
import { FlagIcon, Map } from 'components';
import { Page } from 'pages/Page';
import { CountryPolygon } from 'types/common';
import { convertToPolygons } from 'utils/gmap-helper';

interface Props {
    toast: (title: string, message: string) => void;
}

interface State {
    countryPolygons: CountryPolygon[];
}

class BeerMapPage extends Page<Props, State> {

    state: State = {
        countryPolygons: [],
    };

    componentDidMount() {
        api.consumation.getCountryBoundaries({}).then(countryPolygons => this.setState({ countryPolygons }));
    }

    render() {

        const { countryPolygons } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map defaultCenter={{ lat: 50.666841, lng: 49.800719 }}>
                                    {convertToPolygons(countryPolygons)}
                                </Map>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Countries ({countryPolygons.length})</Card.Header>
                            <Card.Body>
                                <div className="panel-countries">
                                    {countryPolygons.map(countryPolygon =>
                                        <FlagIcon
                                            key={countryPolygon.country.id}
                                            code={countryPolygon.country.id}
                                            country={countryPolygon.country.name}
                                            className="country-flag"
                                            title={countryPolygon.country.name}
                                        />
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default BeerMapPage;
