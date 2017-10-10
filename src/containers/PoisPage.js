import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as init from '../actions/commonActions';
import * as actions from '../actions/poiActions';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import objectAssign from 'object-assign';
import Map from '../components/common/Map';
import * as trackingHelper from '../utils/trackingHelper';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from '../components/common/Select';
import { Marker } from "react-google-maps";
import PoiPanel from '../components/pois/PoiPanel';
import PoiModal from '../components/pois/PoiModal';

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
      }};

    props.init.getPoiCategories();
    props.actions.getPois(this.state.filters);

    this.onFiltersChanged = this.onFiltersChanged.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onMapDragEnd = this.onMapDragEnd.bind(this);
    this.onPoiChange = this.onPoiChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onFiltersChanged(filter){
      let filters = objectAssign({}, this.state.filters, filter);
      this.setState({filters: filters});
      this.props.actions.getPois(filters);
  }

  onMapClick(e){
    this.setState({
      isModalOpen: true,
      poi:{
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng()
      }
    });
  }

  onModalClose(){
    this.setState({ isModalOpen: false });
  }

  onMapDragEnd(){
      let bounds = this.map.state.map.getBounds();

      let filters = objectAssign({}, this.state.filters, { x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f} });
      this.setState({filters: filters});
      this.props.actions.getPois(filters);
  }

  onPoiChange(property){
    let poi = objectAssign({}, this.state.poi, property);
    this.setState({poi: poi});
  }

  onSave(){
    this.props.actions.addPoi(this.state.poi);
    this.setState({ isModalOpen: false });
    this.props.actions.getPois(this.state.filters);
  }

  render() {

    const poiMarkers = this.props.pois.pois.items != null ? this.props.pois.pois.items.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.latitude, lng: poi.longitude}} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
            <Col lg={12}>
                <Panel header={<h4>Map</h4>} className="map-container">
                    <Map
                        onClick={this.onMapClick}
                        ref={map => this.map = map}
                        onDragEnd={this.onMapDragEnd}
                        containerElement={
                            <div style={{ height: `100%` }} />
                        }
                        mapElement={
                            <div style={{ height: `100%` }} />
                        }>
                    {poiMarkers}
                    </Map>
                </Panel>
              </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel header={<h4>Filters</h4>}>
                <ControlLabel>Category</ControlLabel>
                <Select options={this.props.common.poiCategories} onChange={id => this.onFiltersChanged({ categoryId: id })} />
                <ControlLabel>Vendor</ControlLabel>
                <Select options={this.props.common.vendors} onChange={id => this.onFiltersChanged({vendorId: id})} />
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" onChange={x => this.onFiltersChanged({name: x.target.value})} />
            </Panel>
          </Col>
          <Col lg={9}>
            <PoiPanel pois={this.props.pois.pois}
                      pageSize={this.state.filters.pageSize}
                      page={this.state.filters.page}
                      onPageChange={page => this.onFiltersChanged({page: page})} />
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