import React from 'react';
import { Container, Card, Table, ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Button } from 'react-bootstrap';
import geohash from 'ngeohash';

import { Page } from 'pages/page';
import api from 'api/main';
import { Map } from 'components';

import AsyncSelect from 'react-select/async';
import { cityLoader, locationLoader } from 'utils/select-loaders';
import { Rectangle } from '@react-google-maps/api';
import { getChildrenGeohashes } from 'utils/geohash-helper';

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

enum ItemType {
    City = 'city',
    Country = 'country',
    Location = 'location',
}

interface State {
    cityId?: string;
    geohashes: string[];
    itemGeohashes: string[];
    itemType: ItemType;
    locationId?: string;
    precision: number;
    selected: string[];
}

class CitiesPage extends Page<{}, State> {
    state: State = {
        geohashes: [],
        itemGeohashes: [],
        itemType: ItemType.City,
        precision: 3,
        selected: [],
    };

    onCityGeohashClick = (cityGeohash: string) => {
        this.setState({
            itemGeohashes: [
                ...this.state.itemGeohashes.filter(x => x !== cityGeohash),
                ...getChildrenGeohashes(cityGeohash),
            ],
        });
    }

    onCitySelected = async (cityId: string) => {
        const cityGeohashes = await api.city.getGeohashes(cityId);

        this.setState({ cityId, itemGeohashes: cityGeohashes });
    }

    onGeohashClick = (geohash: string) => {
        if (this.state.selected.includes(geohash)) {
            this.setState({ selected: this.state.selected.filter(x => x !== geohash) });
        } else {
            this.setState({ selected: [...this.state.selected, geohash] });
        }
    }

    onLocationSelected = async (locationId: string) => {
        const itemGeohashes = await api.location.getGeohashes(locationId);

        this.setState({ locationId, itemGeohashes });
    }

    onMapClick = (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        const g = geohash.encode(event.latLng?.lat() || 0, event.latLng?.lng() || 0, this.state.precision);
        const children = getChildrenGeohashes(g);

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
        if (this.state.itemType == ItemType.City && this.state.cityId) {
            const distinctSelected = [...new Set(this.state.selected)];
            await api.city.postGeohashes(this.state.cityId, distinctSelected);
            this.setState({
                itemGeohashes: [],
                geohashes: [],
                selected: [],
            });
        } else if (this.state.itemType == ItemType.Location && this.state.locationId) {
            const distinctSelected = [...new Set(this.state.selected)];
            await api.location.postGeohashes(this.state.locationId, distinctSelected);
            this.setState({
                itemGeohashes: [],
                geohashes: [],
                selected: [],
            });

        }
    }

    render() {
        const { itemGeohashes: cityGeohashes, geohashes, itemType } = this.state;

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
                                        onClick={() => this.onGeohashClick(g)}
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
                                        onClick={() => this.onCityGeohashClick(g)}
                                    />
                                );
                            })}
                        </Map>
                    </Card.Body>
                    <Card.Footer>
                        {itemType === ItemType.City &&
                            <AsyncSelect
                                loadOptions={cityLoader}
                                onChange={x => this.onCitySelected(x.value)}
                                defaultOptions
                            />
                        }
                        {itemType === ItemType.Location &&
                            <AsyncSelect
                                loadOptions={locationLoader}
                                onChange={x => this.onLocationSelected(x.value)}
                                defaultOptions
                            />
                        }
                        <ToggleButtonGroup defaultValue={this.state.precision} type="radio" name="precisionOptions" onChange={this.changePrecision}>
                            {[3, 4, 5, 6, 7, 8].map(x =>
                                <ToggleButton key={x} value={x} id={x}>{x}</ToggleButton>
                            )}
                        </ToggleButtonGroup>
                        <ToggleButtonGroup defaultValue={ItemType.City} type="radio" name="itemTypeOptions" onChange={value => this.setState({ itemType: value as ItemType })}>
                            <ToggleButton key={ItemType.City} value={ItemType.City} id={ItemType.City}>City</ToggleButton>
                            <ToggleButton key={ItemType.Country} value={ItemType.Country} id={ItemType.Country}>Country</ToggleButton>
                            <ToggleButton key={ItemType.Location} value={ItemType.Location} id={ItemType.Location}>Location</ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="primary" onClick={this.save}>Save</Button>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }
}

export default CitiesPage;