import React from 'react';
import { ButtonGroup, Card, Col, Container, Row, ToggleButton } from 'react-bootstrap';
import classNames from 'classnames';

import api from 'api/main';
import { Map } from 'components';
import { Page } from 'pages/page';
import { Country } from 'types/common';
import { components } from 'types/ivy-types';
import { Marker } from 'react-google-maps';
import AsyncSelect from 'react-select/async';
import { cityLoader } from 'utils/select-loaders';
import { iconUrl } from 'utils/cdn-helper';

type City = components['schemas']['City'];

enum CountryVisited {
    All,
    Yes,
    No,
}

interface Filters {
    visited: CountryVisited,
}

interface State {
    cities: City[],
    countries: Country[],
    filters: Filters,
    visitedCountries: Country[],
}

class CountriesPage extends Page<{}, State> {

    state: State = {
        cities: [],
        countries: [],
        filters: {
            visited: CountryVisited.All,
        },
        visitedCountries: [],
    }

    componentDidMount() {
        api.city.getVisited().then(cities => this.setState({ cities }));
        api.country.getAll().then(response => this.setState({ countries: response.items }));
        api.country.getVisited({}).then(visitedCountries => this.setState({ visitedCountries }));
    }

    render() {
        const { cities, countries, filters, visitedCountries } = this.state;

        const filteredCountries = filters.visited === CountryVisited.All ?
            countries
            : filters.visited === CountryVisited.Yes ? visitedCountries : countries.filter(c => !visitedCountries.map(x => x.id).includes(c.id));

        const visitedRadios = [
            { name: 'All', value: CountryVisited.All },
            { name: 'Yes', value: CountryVisited.Yes },
            { name: 'No', value: CountryVisited.No },
        ];

        return (
            <Container>
                <Row>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-medium">
                                <Map>
                                    {cities.map(city =>
                                        <Marker
                                            key={city.id}
                                            icon={iconUrl('location-small')}
                                            defaultPosition={{ lat: city.lat, lng: city.lng }}
                                            title={city.name}
                                        />
                                    )}
                                </Map>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3}>
                        <AsyncSelect
                            loadOptions={cityLoader}
                            onChange={city => this.addVisitedCity(city.value)}
                            defaultOptions
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <ButtonGroup>
                                    {visitedRadios.map(radio =>
                                        <ToggleButton
                                            type="radio"
                                            checked={filters.visited === radio.value}
                                            value={radio.value}
                                            onClick={() => this.onFiltersChanged({ visited: radio.value })}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    )}
                                </ButtonGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        {filteredCountries.sort((a, b) => a.name.localeCompare(b.name)).map(country =>
                            <Card>
                                <Card.Body className={classNames('country-item', { 'country-item-not-visited': !visitedCountries.map(x => x.id).includes(country.id) })}>
                                    <span className={`flag-icon flag-icon-${country.id?.toLowerCase()} country-flag`} />
                                    <h2>{country.name}</h2>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container >
        );
    }

    addVisitedCity = (cityId: string) => {
        api.city.postVisited(cityId);
    }

    onFiltersChanged = (changed: Partial<Filters>) => {
        this.setState({
            filters: {
                ...this.state.filters,
                ...changed,
            }
        });
    }
}

export default CountriesPage;