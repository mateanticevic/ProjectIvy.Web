import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import objectAssign from 'object-assign';
import TripTable from './TripTable';
import TripRow from './TripRow';
import TripModal from './TripModal';
import Map from '../common/Map';
import { Polygon } from "react-google-maps";
import * as trackingHelper from '../../utils/trackingHelper';

class TripsIndex extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.props.actions.getTrips(props.trips.filters);
    this.props.actions.getCountyVisitedBoundaries();

    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  onFiltersChanged(filterValue){
    let filters = objectAssign({}, this.props.trips.filters, filterValue);
    this.props.actions.changedFilters(filters);
  }

  onMapClick(e){
    console.log(`${e.latLng.lat()}, ${e.latLng.lng()}`);
  }

  render() {

    const countryPolygons = this.props.trips.countries.map(country => {
      return country.polygons.map(path => <Polygon path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const trips = this.props.trips.trips;

    const tripsHeader = `Trips (${trips.count})`;

    const tripRows = this.props.trips.trips.items.map(function(trip){
      return <TripRow key={trip.id} trip={trip}/>;
    });

    return (
      <Grid>
        <Row>
          <Panel header="Map" className="map-container">
            <Map
              onClick={this.onMapClick}
              containerElement={
                <div style={{ height: `100%` }} />
              }
              mapElement={
                <div style={{ height: `100%` }} />
              }>
              {polygons}
            </Map>
          </Panel>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel header="Filters">
              <div/>
            </Panel>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header={tripsHeader}>
                    <Row>
                      <Col lg={12}>
                        <Button onClick={this.props.actions.openModal}>New</Button>                  
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <TripTable>
                          {tripRows}
                        </TripTable>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(this.props.trips.trips.count / this.props.trips.filters.pageSize)}
                                                                                maxButtons={5}
                                                                                activePage={this.props.trips.filters.page}
                                                                                onSelect={page => this.onFiltersChanged({page: page})} />
                      </Col>
                    </Row>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
        <TripModal onClose={this.props.actions.closeModal}
                   isOpen={this.props.trips.isModalOpen}/>
      </Grid>
    );
  }
}

export default TripsIndex;

TripsIndex.propTypes = {
  actions: React.PropTypes.object,
  trips: React.PropTypes.object
};