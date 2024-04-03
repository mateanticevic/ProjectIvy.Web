import React from 'react';
import { Container, Card, ToggleButtonGroup, ToggleButton, Button, Col, Row, FormGroup, FormLabel } from 'react-bootstrap';
import geohash from 'ngeohash';

import { Page } from 'pages/page';
import { Map } from 'components';
import AsyncSelect from 'react-select/async';
import { Rectangle } from '@react-google-maps/api';
import { getChildrenGeohashes } from 'utils/geohash-helper';
import { GeohashRectangle } from './geohash-rectangle';
import { ItemType, SelectType, apis, deleteRectangleOptions, itemGeohashRectangleOptions, loaders, rectangleOptions } from './constants';
import { FaCity, FaSave } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { FaLocationDot, FaTableCells } from 'react-icons/fa6';
import { GrClear } from 'react-icons/gr';
import { MdOutlinePhotoSizeSelectSmall } from 'react-icons/md';

interface State {
    geohashes: string[];
    itemGeohashes: string[];
    itemId?: string;
    itemType: ItemType;
    precision: number;
    selected: string[];
    selectedForDeletion: string[];
    selectType: SelectType;
}

class CitiesPage extends Page<{}, State> {
    map?: google.maps.Map;

    state: State = {
        geohashes: [],
        itemGeohashes: [],
        itemType: ItemType.Country,
        precision: 3,
        selected: [],
        selectedForDeletion: [],
        selectType: SelectType.Select,
    };

    changePrecision = (precision: number) => {
        this.setState({
            geohashes: [],
            precision,
            selected: [],
        });
    }

    clearAll = () => {
        this.setState({
            geohashes: [],
            itemGeohashes: [],
            selected: [],
            selectedForDeletion: [],
        });
    }

    onDeleteGeohash = async () => {
        if (!this.state.itemId) return;

        apis[this.state.itemType].deleteGeohashes(this.state.itemId, { ids: this.state.selected });
    }

    onGeohashClick = (geohash: string) => {
        if (this.state.selected.includes(geohash)) {
            this.setState({ selected: this.state.selected.filter(x => x !== geohash) });
        } else {
            this.setState({ selected: [...this.state.selected, geohash] });
        }
    }

    onItemGeohashClick = (geohash: string) => {
        if (this.state.selectType === SelectType.Select) {
            this.setState({
                itemGeohashes: this.state.itemGeohashes.filter(x => x !== geohash),
                selectedForDeletion: [
                    ...this.state.selectedForDeletion,
                    geohash,
                ]
            });
        } else {
            this.setState({
                itemGeohashes: [
                    ...this.state.itemGeohashes.filter(x => x !== geohash),
                    ...getChildrenGeohashes(geohash),
                ],
            });
        }
    }

    onItemSelected = async (itemId: string) => {
        const itemGeohashes = await apis[this.state.itemType].getGeohashes(itemId);

        this.setState({
            itemId,
            itemGeohashes,
        });
        if (itemGeohashes.length > 0) {
            this.setMapBounds(itemGeohashes);
        }
    }

    onMapClick = (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        const g = geohash.encode(event.latLng?.lat() || 0, event.latLng?.lng() || 0, this.state.precision);
        const children = getChildrenGeohashes(g);

        this.setState({
            geohashes: [
                ...this.state.geohashes,
                ...children.filter(x => !this.state.itemGeohashes.includes(x)),
            ]
        });
    }

    onSelectedForDeletionGeohashClicked = (geohash: string) => {
        this.setState({
            itemGeohashes: [
                ...this.state.itemGeohashes,
                geohash,
            ],
            selectedForDeletion: this.state.selectedForDeletion.filter(x => x !== geohash),
        });
    }

    save = async () => {
        if (!this.state.itemId) return;

        if (this.state.selectedForDeletion.length > 0) {
            await apis[this.state.itemType].deleteGeohashes(this.state.itemId!, { ids: this.state.selectedForDeletion });
        }

        if (this.state.selected.length > 0) {
            const distinctSelected = [...new Set(this.state.selected)];
            await apis[this.state.itemType].postGeohashes(this.state.itemId!, distinctSelected);
        }

        this.setState({
            geohashes: [],
            itemGeohashes: [
                ...this.state.itemGeohashes,
                ...this.state.selected,
            ],
            selected: [],
            selectedForDeletion: [],
        });
    }

    setMapBounds = (geohashes: string[]) => {
        const bounds = new google.maps.LatLngBounds();
        geohashes.forEach(g => {
            const box = geohash.decode_bbox(g);

            bounds.extend(new google.maps.LatLng(box[0], box[1]));
            bounds.extend(new google.maps.LatLng(box[2], box[3]));
        });
        this.map?.fitBounds(bounds);
    }

    render() {
        const { itemGeohashes, geohashes, itemType, selectedForDeletion } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Body>
                                <AsyncSelect
                                    loadOptions={loaders[itemType]}
                                    onChange={x => this.onItemSelected(x.value)}
                                    placeholder="Search by name or id"
                                    defaultOptions
                                />
                                <ToggleButtonGroup defaultValue={this.state.precision} type="radio" name="precisionOptions" onChange={this.changePrecision}>
                                    {[2, 3, 4, 5, 6, 7, 8].map(x =>
                                        <ToggleButton key={x} value={x} id={x}>{x}</ToggleButton>
                                    )}
                                </ToggleButtonGroup>
                                <FormGroup>
                                    <FormLabel>Item type</FormLabel>
                                    <ToggleButtonGroup defaultValue={ItemType.Country} type="radio" name="itemTypeOptions" onChange={value => this.setState({ itemType: value as ItemType })}>
                                        <ToggleButton key={ItemType.Country} value={ItemType.Country} id={ItemType.Country}><BiWorld /> Country</ToggleButton>
                                        <ToggleButton key={ItemType.City} value={ItemType.City} id={ItemType.City}><FaCity /> City</ToggleButton>
                                        <ToggleButton key={ItemType.Location} value={ItemType.Location} id={ItemType.Location}><FaLocationDot /> Location</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Select mode</FormLabel>
                                    <ToggleButtonGroup defaultValue={SelectType.Select} type="radio" name="selectTypeOptions" onChange={value => this.setState({ selectType: value as SelectType })}>
                                        <ToggleButton key={SelectType.Select} value={SelectType.Select} id={SelectType.Select}><MdOutlinePhotoSizeSelectSmall />Select</ToggleButton>
                                        <ToggleButton key={SelectType.Divide} value={SelectType.Divide} id={SelectType.Divide}><FaTableCells /> Divide</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Button variant="primary" onClick={this.save}><FaSave /> Save</Button>
                                    <Button variant="primary" onClick={this.clearAll}><GrClear /> Clear</Button>
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <Card.Body className="padding-0 panel-large">
                                <Map
                                    defaultZoom={2}
                                    onClick={this.onMapClick}
                                    onLoad={map => this.map = map}
                                >
                                    {geohashes.map(g => {
                                        const rectangle = geohash.decode_bbox(g);

                                        const options = this.state.selected.includes(g) ? itemGeohashRectangleOptions : rectangleOptions;

                                        return (
                                            <Rectangle
                                                key={g}
                                                options={options}
                                                bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
                                                onClick={() => this.onGeohashClick(g)}
                                            />
                                        );
                                    })}
                                    {itemGeohashes.map(g => {
                                        const rectangle = geohash.decode_bbox(g);

                                        return (
                                            <Rectangle
                                                key={g}
                                                options={itemGeohashRectangleOptions}
                                                bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
                                                onClick={() => this.onItemGeohashClick(g)}
                                            />
                                        );
                                    })}
                                    {selectedForDeletion.map(g =>
                                        <GeohashRectangle
                                            geohash={g}
                                            options={deleteRectangleOptions}
                                            onClick={this.onSelectedForDeletionGeohashClicked}
                                        />
                                    )}
                                </Map>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default CitiesPage;