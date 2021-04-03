import { boundMethod } from 'autobind-decorator';
import React from 'react';
import { Col, FormLabel, FormControl, Container, Card, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Marker } from 'react-google-maps';

import api from '~api/main';
import Map from '~components/Map';
import Select from '~components/Select';
import PoiModal from './PoiModal';
import PoiPanel from './PoiPanel';

class PoisPage extends React.Component {

    state = {
        poi: {
            latitude: 0,
            longitude: 0,
        },
        pois: {
            count: 0,
            items: [],
        },
        isModalOpen: false,
        filters: {
            page: 1,
            pageSize: 10,
        },
        poiCategories: [],
        vendors: [],
    };

    componentDidMount() {
        this.onFiltersChanged();
        api.common.getPoiCategories().then((poiCategories) => this.setState({ poiCategories }));
        api.vendor.get(this.state.filters).then((vendors) => this.setState({ vendors: vendors.items }));
    }

    render() {

        const poiMarkers = this.state.pois.items != null ? this.state.pois.items.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.location.latitude, lng: poi.location.longitude }} title={poi.name} />) : null;

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map onClick={this.onMapClick}
                                    map={map => this.map = map}
                                    onDragEnd={this.onMapDragEnd}>
                                    {poiMarkers}
                                </Map>
                            </Card.Body>
                            <Card.Footer>
                                <ToggleButtonGroup type="radio" name="options" defaultValue={'move'}>
                                    <ToggleButton value={'move'}><FontAwesome name="arrows" /> Move</ToggleButton>
                                    <ToggleButton value={'new'}><FontAwesome name="map-marker" /> New</ToggleButton>
                                </ToggleButtonGroup>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <FormLabel>Category</FormLabel>
                                <Select options={this.state.poiCategories} onChange={id => this.onFiltersChanged({ categoryId: id })} />
                                <FormLabel>Vendor</FormLabel>
                                <Select options={this.state.vendors} onChange={id => this.onFiltersChanged({ vendorId: id })} />
                                <FormLabel>Name</FormLabel>
                                <FormControl
                                    type="text"
                                    onChange={x => this.onFiltersChanged({ name: x.target.value })}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <PoiPanel
                            pagedItems={{ page: this.state.filters.page, pageSize: this.state.filters.pageSize, list: this.state.pois }}
                            onNewClick={this.onNewClick}
                            addToTrip={this.onAddToTrip}
                            onPageChange={(page) => this.onFiltersChanged({ page })}
                        />
                    </Col>
                </Row>
                <PoiModal isOpen={this.state.isModalOpen}
                    onClose={this.onModalClose}
                    onSave={this.onSave}
                    categories={this.state.poiCategories}
                    onPoiChange={this.onPoiChange}
                    poi={this.state.poi}
                />
            </Container>
        );
    }

    public onAddToTrip(poiId: string) {
    }

    @boundMethod
    public onFiltersChanged(filter?) {
        const filters = { ...this.state.filters, ...filter };
        this.setState({ filters });
        api.poi.get(filters).then((pois) => this.setState({ pois }));
    }

    @boundMethod
    public onMapClick(e) {
        this.setState({
            isModalOpen: true,
            poi: {
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng(),
            },
        });
    }

    @boundMethod
    public onMapDragEnd() {
        // let bounds = this.map.state.map.getBounds();

        // let filters = { ...this.state.filters, x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f } };
        // this.setState({ filters: filters });
    }

    @boundMethod
    public onModalClose() {
        this.setState({ isModalOpen: false });
    }

    @boundMethod
    public onNewClick() {
        this.setState({ isModalOpen: true });
    }

    @boundMethod
    public onPoiChange(property: object) {
        const poi = { ...this.state.poi, ...property };
        this.setState({ poi });
    }

    @boundMethod
    public onSave() {
        this.setState({ isModalOpen: false });
        this.onFiltersChanged();
    }
}

export default PoisPage;
