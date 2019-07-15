import React from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap/lib';
import { Polygon } from "react-google-maps";
import _ from 'lodash';

import * as trackingHelper from '../../utils/trackingHelper';
import { Map, Pagination } from '../../components/common';
import * as tripApi from '../../api/main/trip';
import * as countryApi from '../../api/main/country';
import { boundMethod } from 'autobind-decorator';
import TripRow from './TripRow';
import { TripTable } from './TripTable';
import TripModal from './TripModal';

type State = {
  countries: any,
  filters: any,
  isModalOpen: boolean,
  trips: any
}

class TripsPage extends React.Component<{}, State> {

  state: State = {
    countries: [],
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    trips: { count: 0, items: [] }
  }

  componentDidMount() {
    countryApi.getVisitedBoundaries().then(countries => this.setState({ countries }));
    this.onFiltersChanged();
  }

  @boundMethod
  onFiltersChanged(filterValue) {
    let filters = { ...this.state.filters, ...filterValue };
    tripApi.get(filters).then(trips => this.setState({
      filters,
      trips
    }));
  }

  render() {
    const countryPolygons = this.state.countries.map(country => {
      return country.polygons.map(path => <Polygon key={_.uniqueId('polygon_country_')} path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const tripsHeader = `Trips (${this.state.trips.count})`;

    const tripRows = this.state.trips.items.map(trip => {
      return <TripRow key={trip.id} trip={trip} />;
    });

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-medium">
                <Map onClick={() => { }}>
                  {polygons}
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header={tripsHeader}>
                  <Panel.Heading>{tripsHeader}</Panel.Heading>
                  <Panel.Body>
                    <Row>
                      <Col lg={12}>
                        <TripTable>
                          {tripRows}
                        </TripTable>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination page={this.state.filters.page}
                          pages={Math.ceil(this.state.trips.count / this.state.filters.pageSize)}
                          onPageChange={page => this.onFiltersChanged({ page })} />
                      </Col>
                    </Row>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
        <TripModal onClose={() => this.setState({ isModalOpen: false })}
          isOpen={this.state.isModalOpen} />
      </Grid>
    );
  }
}

export default TripsPage;