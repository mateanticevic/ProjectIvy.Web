import React from 'react';
import { Grid, Row, Col, ControlLabel, FormControl, Panel, ToggleButtonGroup, ToggleButton } from 'react-bootstrap/lib';
import { Marker } from "react-google-maps";
import FontAwesome from 'react-fontawesome';

import Select from '../../components/common/Select';
import Map from '../../components/common/Map';
import PoiModal from './PoiModal';
import PoiPanel from './PoiPanel';
import * as commonApi from '../../api/main/common';
import * as poiApi from '../../api/main/poi';
import * as vendorApi from '../../api/main/vendor';
import { boundMethod } from 'autobind-decorator';

class PoisPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      poi: {
        latitude: 0,
        longitude: 0
      },
      pois: {
        count: 0,
        items: []
      },
      isModalOpen: false,
      filters: {
        page: 1,
        pageSize: 10
      },
      poiCategories: [],
      vendors: []
    };
  }

  componentDidMount() {
    this.onFiltersChanged();
    commonApi.getPoiCategories().then(poiCategories => this.setState({ poiCategories }));
    vendorApi.get(this.state.filters).then(vendors => this.setState({ vendors: vendors.items }));
  }

  onAddToTrip(poiId: string) {
  }

  @boundMethod
  onFiltersChanged(filter) {
    let filters = { ...this.state.filters, ...filter };
    this.setState({ filters: filters });
    poiApi.get(filters).then(pois => this.setState({ pois }));
  }

  @boundMethod
  onMapClick(e) {
    this.setState({
      isModalOpen: true,
      poi: {
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng()
      }
    });
  }

  @boundMethod
  onModalClose() {
    this.setState({ isModalOpen: false });
  }

  @boundMethod
  onMapDragEnd() {
    //let bounds = this.map.state.map.getBounds();

    //let filters = { ...this.state.filters, x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f } };
    //this.setState({ filters: filters });
  }

  @boundMethod
  onNewClick() {
    this.setState({ isModalOpen: true });
  }

  @boundMethod
  onPoiChange(property: object) {
    let poi = { ...this.state.poi, ...property };
    this.setState({ poi: poi });
  }

  @boundMethod
  onSave() {
    this.setState({ isModalOpen: false });
    this.onFiltersChanged();
  }

  render() {

    const poiMarkers = this.state.pois.items != null ? this.state.pois.items.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.location.latitude, lng: poi.location.longitude }} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-large">
                <Map onClick={this.onMapClick}
                  map={map => this.map = map}
                  onDragEnd={this.onMapDragEnd}>
                  {poiMarkers}
                </Map>
              </Panel.Body>
              <Panel.Footer>
                <ToggleButtonGroup type="radio" name="options" defaultValue={'move'}>
                  <ToggleButton value={'move'}><FontAwesome name="arrows" /> Move</ToggleButton>
                  <ToggleButton value={'new'}><FontAwesome name="map-marker" /> New</ToggleButton>
                </ToggleButtonGroup>
              </Panel.Footer>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>Filters</Panel.Heading>
              <Panel.Body>              <ControlLabel>Category</ControlLabel>
                <Select options={this.state.poiCategories} onChange={id => this.onFiltersChanged({ categoryId: id })} />
                <ControlLabel>Vendor</ControlLabel>
                <Select options={this.state.vendors} onChange={id => this.onFiltersChanged({ vendorId: id })} />
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" onChange={x => this.onFiltersChanged({ name: x.target.value })} />
              </Panel.Body>
            </Panel>
          </Col>
          <Col lg={9}>
            <PoiPanel
              pagedItems={{ page: this.state.filters.page, pageSize: this.state.filters.pageSize, list: this.state.pois }}
              onNewClick={this.onNewClick}
              addToTrip={this.onAddToTrip}
              onPageChange={page => this.onFiltersChanged({ page: page })} />
          </Col>
        </Row>
        <PoiModal isOpen={this.state.isModalOpen}
          onClose={this.onModalClose}
          onSave={this.onSave}
          categories={this.state.poiCategories}
          onPoiChange={this.onPoiChange}
          poi={this.state.poi} />
      </Grid>
    );
  }
}

export default PoisPage;