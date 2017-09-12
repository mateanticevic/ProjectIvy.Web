import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as init from '../actions/commonActions';
import * as actions from '../actions/poiActions';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import objectAssign from 'object-assign';
import Map from '../components/common/Map';
import { Polygon } from "react-google-maps";
import * as trackingHelper from '../utils/trackingHelper';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Datetime from 'react-datetime';
import Select from '../components/common/Select';
import { Marker, Polyline } from "react-google-maps";
import PoiPanel from '../components/pois/PoiPanel';

class PoisPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
        filters: {
            page: 1,
            pageSize: 10
    }};

    props.init.getPoiCategories();
    props.actions.getPois(this.state.filters);

    this.onFiltersChanged = this.onFiltersChanged.bind(this);
    this.onMapDragEnd = this.onMapDragEnd.bind(this);
  }

  onFiltersChanged(filter){
      let filters = objectAssign({}, this.state.filters, filter);
      this.setState({filters: filters});
      this.props.actions.getPois(filters);
  }

  onMapDragEnd(){
      let bounds = this.map.state.map.getBounds();

      let filters = objectAssign({}, this.state.filters, { x: { lat: bounds.f.b, lng: bounds.b.b }, y: { lat: bounds.f.f, lng: bounds.b.f} });
      this.setState({filters: filters});
      this.props.actions.getPois(filters);
  }

  render() {

    const poiMarkers = this.props.pois.pois.items != null ? this.props.pois.pois.items.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.latitude, lng: poi.longitude}} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
            <Col lg={12}>
                <Panel header="Map" className="map-container">
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
            <Panel header="Filters">
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