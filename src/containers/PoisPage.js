import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, ControlLabel, FormControl, Panel } from 'react-bootstrap/lib';
import { Marker } from "react-google-maps";
import * as actions from '../actions/poiActions';
import * as init from '../actions/commonActions';

import { Map, Select } from '../components/common';
import { PoiPanel, PoiModal } from '../components/pois';

class PoisPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      poi: {
        latitude: 0,
        longitude: 0
      },
      isModalOpen: false,
      filters: {
        page: 1,
        pageSize: 10
      }
    };

    props.init.getPoiCategories();
    props.init.getVendors();
    props.actions.getPois(this.state.filters);

    this.onAddToTrip = this.onAddToTrip.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
    this.onNewClick = this.onNewClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onMapDragEnd = this.onMapDragEnd.bind(this);
    this.onPoiChange = this.onPoiChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onAddToTrip(poiId) {
    this.props.actions.addPoiToTrip("finland-and-estonia", poiId);
  }

  onFiltersChanged(filter) {
    let filters = { ...this.state.filters, ...filter };
    this.setState({ filters: filters });
    this.props.actions.getPois(filters);
  }

  onMapClick(e) {
    this.setState({
      isModalOpen: true,
      poi: {
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng()
      }
    });
  }

  onModalClose() {
    this.setState({ isModalOpen: false });
  }

  onMapDragEnd() {
    let bounds = this.map.state.map.getBounds();

    let filters = { ...this.state.filters, x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f } };
    this.setState({ filters: filters });
    this.props.actions.getPois(filters);
  }

  onNewClick() {
    this.setState({ isModalOpen: true });
  }

  onPoiChange(property) {
    let poi = { ...this.state.poi, ...property };
    this.setState({ poi: poi });
  }

  onSave() {
    this.props.actions.addPoi(this.state.poi);
    this.setState({ isModalOpen: false });
    this.props.actions.getPois(this.state.filters);
  }

  render() {

    const poiMarkers = this.props.pois.pois.items != null ? this.props.pois.pois.items.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.latitude, lng: poi.longitude }} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-medium">
                <Map onClick={this.onMapClick}
                  map={map => this.map = map}
                  onDragEnd={this.onMapDragEnd}>
                  {poiMarkers}
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>Filters</Panel.Heading>
              <Panel.Body>              <ControlLabel>Category</ControlLabel>
                <Select options={this.props.common.poiCategories} onChange={id => this.onFiltersChanged({ categoryId: id })} />
                <ControlLabel>Vendor</ControlLabel>
                <Select options={this.props.common.vendors} onChange={id => this.onFiltersChanged({ vendorId: id })} />
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" onChange={x => this.onFiltersChanged({ name: x.target.value })} />
              </Panel.Body>
            </Panel>
          </Col>
          <Col lg={9}>
            <PoiPanel pois={this.props.pois.pois}
              pageSize={this.state.filters.pageSize}
              page={this.state.filters.page}
              onNewClick={this.onNewClick}
              addToTrip={this.onAddToTrip}
              onPageChange={page => this.onFiltersChanged({ page: page })} />
          </Col>
        </Row>
        <PoiModal isOpen={this.state.isModalOpen}
          onClose={this.onModalClose}
          onSave={this.onSave}
          categories={this.props.common.poiCategories}
          onPoiChange={this.onPoiChange}
          poi={this.state.poi} />
      </Grid>
    );
  }
}

PoisPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    common: state.common,
    pois: state.pois
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    init: bindActionCreators(init, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PoisPage);