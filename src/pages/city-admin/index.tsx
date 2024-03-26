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

const cityRectangleOptions: google.maps.RectangleOptions = {
    strokeColor: '#007BFF',
    fillColor: '#007BFF',
    fillOpacity: 0.2,
    strokeWeight: 1,
};

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

interface State {
    cityId?: string;
    cityGeohashes: string[];
    geohashes: string[];
    precision: number;
    selected: string[];
}

class CitiesPage extends Page<{}, State> {
    state: State = {
        cityGeohashes: [],
        geohashes: [],
        precision: 3,
        selected: [],
    };

    citySelected = async (cityId: string) => {
        const cityGeohashes = await api.city.getGeohashes(cityId);

        this.setState({ cityId, cityGeohashes });
    }

    onMapClick = (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        const g = geohash.encode(event.latLng?.lat() || 0, event.latLng?.lng() || 0, this.state.precision);
        const geohashLetters = "0123456789bcdefghjkmnpqrstuvwxyz".split('');

        const children = geohashLetters.map(l => `${g}${l}`);
        this.setState({
            geohashes: [
                ...this.state.geohashes,
                ...children,
            ]
        });
    }

    changePrecision = (precision: number) => {
        this.setState({
            geohashes: [],
            precision,
            selected: [],
         });
    }

    save = async () => {
        if (!this.state.cityId) {
            return;
        }

        const distinctSelected = [...new Set(this.state.selected)];
        await api.city.postGeohashes(this.state.cityId, distinctSelected);
        this.setState({
            cityGeohashes: [],
            geohashes: [],
            selected: [],
        })
    }

    render() {
        const { cityGeohashes, geohashes } = this.state;

        return (
            <Container>
                <Card>
                    <Card.Header>
                        <h5>Cities</h5>
                    </Card.Header>
                    <Card.Body className="padding-0 panel-large">
                        <Map
                            defaultZoom={2}
                            onClick={this.onMapClick}
                        >
                            {geohashes.map(g => {
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
                            {cityGeohashes.map(g => {
                                const rectangle = geohash.decode_bbox(g);

                                return (
                                    <Rectangle
                                        key={g}
                                        options={cityRectangleOptions}
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
                            onChange={x => this.citySelected(x.value)}
                            defaultOptions
                        />
                        <ToggleButtonGroup defaultValue={this.state.precision} type="radio" name="options" onChange={this.changePrecision}>
                            {[3, 4, 5, 6].map(x =>
                                <ToggleButton key={x} value={x} id={x}>{x}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                        <Button variant="primary" onClick={this.save}>Save</Button>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }
}

export default CitiesPage;