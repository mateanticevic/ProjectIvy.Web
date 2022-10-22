import React from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import classNames from 'classnames';

import api from 'api/main';
import { Page } from 'pages/page';
import { Country } from 'types/common';


interface State {
    countries: Country[],
    visitedCountries: Country[],
}

class CountriesPage extends Page<{}, State> {

    state: State = {
        countries: [],
        visitedCountries: [],
    }

    componentDidMount() {
        api.country.getAll().then(response => this.setState({ countries: response.items }));
        api.country.getVisited({}).then(visitedCountries => this.setState({ visitedCountries }));
    }

    render() {
        const { countries, visitedCountries } = this.state;
        return (
            <Container>
                <Row>
                    {countries.map(country =>
                        <Card>
                            <Card.Body className={classNames('country-item', { 'country-item-not-visited': !visitedCountries.map(x => x.id).includes(country.id) })}>
                                <span className={`flag-icon flag-icon-${country.id?.toLowerCase()} country-flag`} />
                                <h2>{country.name}</h2>
                            </Card.Body>
                        </Card>
                    )}
                </Row>
            </Container>
        );
    }
}

export default CountriesPage;