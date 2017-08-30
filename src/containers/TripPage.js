import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import * as actions from '../actions/tripActions';
import Map from '../components/common/Map';
import { Marker, Polyline } from "react-google-maps";
import * as trackingHelper from '../utils/trackingHelper';

class TripPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    props.actions.getTrip(props.params.id);
  }

  render() {

    const trip = this.props.trip.trip;

    const poiMarkers = trip.pois != null ? trip.pois.map(poi => <Marker defaultPosition={{ lat: poi.latitude, lng: poi.longitude}} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
          <h1>{trip.name}</h1>
        </Row>
        <Row>
          <Panel header="Map" className="map-container">
            <Map
              containerElement={
                <div style={{ height: `100%` }} />
              }
              mapElement={
                <div style={{ height: `100%` }} />
              }>
              {poiMarkers}
              <Polyline path={this.props.trip.trackings} />
            </Map>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

TripPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    trip: state.trip
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripPage);
