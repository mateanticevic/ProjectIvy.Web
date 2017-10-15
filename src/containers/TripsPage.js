import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Grid, Row, Col, Pagination } from 'react-bootstrap/lib';
import { Polygon } from "react-google-maps";
import * as actions from '../actions/tripsActions';
import Panel from '../components/common/Panel';
import TripTable from '../components/trips/TripTable';
import TripRow from '../components/trips/TripRow';
import TripModal from '../components/trips/TripModal';
import Map from '../components/common/Map';
import * as trackingHelper from '../utils/trackingHelper';

class TripsPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.props.actions.getTrips(props.trips.filters);
    this.props.actions.getCountyVisitedBoundaries();

    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  onFiltersChanged(filterValue){
    let filters = {...this.props.trips.filters, filterValue};
    this.props.actions.changedFilters(filters);
  }

  onMapClick(){

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
          <Col lg={12}>
            <Panel header="Map" containsMap>
              <Map onClick={this.onMapClick}>
                {polygons}
              </Map>
            </Panel>
          </Col>
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

TripsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trips: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    trips: state.trips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);