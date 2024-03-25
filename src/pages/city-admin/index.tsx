import React from 'react';
import { Container, Card, Table, ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Button } from 'react-bootstrap';
import geohash from 'ngeohash';

import { Page } from 'pages/page';
import api from 'api/main';
import { BrandFilters } from 'types/beer';
import { Country } from 'types/common';
import { Select, Pagination, Map } from 'components';
import { components } from 'types/ivy-types';
import AsyncSelect from 'react-select/async';
import { cityLoader } from 'utils/select-loaders';
import { Rectangle } from '@react-google-maps/api';

const rectangleOptions: google.maps.RectangleOptions = {
    strokeColor: '#0d6efd',
    fillOpacity: 0.1,
    strokeWeight: 1,
};

const rectangleOptionsSelected: google.maps.RectangleOptions = {
    strokeColor: '#0d6efd',
    fillOpacity: 0.6,
    strokeWeight: 1,
};

type City = components['schemas']['City'];

interface State {
    cityId?: string;
    selected: string[];
}

class CitiesPage extends Page<{}, State> {
    state: State = {
        selected: [],
    };

    save = async () => {
        if (!this.state.cityId){
            return;
        }

        await api.city.postGeohashes(this.state.cityId, this.state.selected);
    }

    render() {
        const { } = this.state;
        const prefixes = ['trjf','trjc','txsg','txsu'];
        const geohashLetters = "0123456789bcdefghjkmnpqrstuvwxyz".split('');

        const children = prefixes.map(p => geohashLetters.map(l => `${p}${l}`)).flatMap(x => x);

        return (
            <Container>
                <Card>
                    <Card.Header>
                        <h5>Cities</h5>
                    </Card.Header>
                    <Card.Body className="padding-0 panel-large">
                        <Map defaultZoom={2}>
                            {children.map(g => {
                                const rectangle = geohash.decode_bbox(g);

                                const options = this.state.selected.includes(g) ? rectangleOptionsSelected : rectangleOptions;

                                return (
                                    <Rectangle
                                        key={g}
                                        options={options}
                                        bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
                                        onClick={() => this.setState({ selected: [...this.state.selected, g] })}
                                    />
                                );
                            })}
                        </Map>
                    </Card.Body>
                    <Card.Footer>
                        <AsyncSelect
                            loadOptions={cityLoader}
                            onChange={x => this.setState({ cityId: x.value })}
                            defaultOptions
                        />
                        <Button variant="primary" onClick={this.save}>Save</Button>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }
}

export default CitiesPage;