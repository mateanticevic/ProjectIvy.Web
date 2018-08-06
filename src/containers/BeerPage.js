import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Panel, Table, Button, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';
import Moment from 'react-moment';

import * as actions from '../actions/beerActions';
import * as urlHelper from '../utils/urlHelper';
import ConsumationFilters from '../components/beer/ConsumationFilters';
import ConsumationModal from '../components/beer/ConsumationModal';
import BeerModal from '../components/beer/BeerModal';
import BrandModal from '../components/beer/BrandModal';

class BeerPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      beerModalOpen: false,
      brandModalOpen: false,
      consumationModalOpen: false,
      filters: {}
    };

    this.onBeerChange = this.onBeerChange.bind(this);
    this.onBrandChange = this.onBrandChange.bind(this);
    this.onConsumationChange = this.onConsumationChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);

    props.actions.getBrands();
    props.actions.getServings();
    this.onFiltersChange();
  }

  onBeerChange(beerValue) {
    const beer = { ...this.props.beer.beer, ...beerValue };
    this.props.actions.beerChange(beer);
  }

  onBrandChange(brandValue) {
    this.props.actions.brandChange({ ...brandValue });
  }

  onConsumationChange(consumationValue) {
    const consumation = { ...this.props.beer.consumation.item, ...consumationValue };
    this.props.actions.consumationChange(consumation);
  }

  onFiltersChange(filterValue) {
    const filters = filterValue ? { ...this.state.filters, ...filterValue } : { ...this.state.filters, ...(urlHelper.queryStringToJson(window.location.search)) };
    window.history.pushState(null, null, window.location.pathname + urlHelper.jsonToQueryString(filters));

    this.setState({ ...this.state, filters: filters });
    this.props.actions.getConsumations(filters);
    this.props.actions.getConsumationSum(filters);
    this.props.actions.getConsumationSumByBeer({ ...filters, pageSize: 5 });
  }

  render() {

    const state = this.props.beer;

    const consumations = state.consumations.items.map(consumation => <tr>
      <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
      <td>{consumation.beer.name}</td>
      <td>{consumation.serving}</td>
      <td>{consumation.volume / 1000}L</td>
    </tr>);

    const topBeers = state.topBeers.map(beer => <ListGroupItem className="list-group-item border-no-radius border-no-left border-no-right">{beer.by.name} {beer.sum / 1000}L</ListGroupItem>);

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>Filters</Panel.Heading>
              <Panel.Body>
                <ConsumationFilters filters={this.state.filters}
                  onChange={this.onFiltersChange}
                  servings={state.servings}
                  brands={state.brands} />
              </Panel.Body>
            </Panel>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>
                    <Row>
                      <Col xs={10}>
                        Consumations ({state.consumations.count})
                  </Col>
                      <Col xs={2}>
                        <DropdownButton title="New" bsStyle="primary" bsSize="xsmall" className="pull-right">
                          <MenuItem eventKey="1" onClick={() => this.setState({ ...this.state, consumationModalOpen: true })}>Consumation</MenuItem>
                          <MenuItem eventKey="2" onClick={() => this.setState({ ...this.state, beerModalOpen: true })}>Beer</MenuItem>
                          <MenuItem eventKey="2" onClick={() => this.setState({ ...this.state, brandModalOpen: true })}>Brand</MenuItem>
                        </DropdownButton>
                      </Col>
                    </Row>
                  </Panel.Heading>
                  <Panel.Body>
                    <Table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Beer</th>
                          <th>Serving</th>
                          <th>Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumations}
                      </tbody>
                    </Table>
                  </Panel.Body>
                  <Panel.Footer>
                    Sum ~{Math.ceil(this.props.beer.sum / 1000)}L
              </Panel.Footer>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>
                    By serving
                </Panel.Heading>
                  <Panel.Body>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>
                Top beers
              </Panel.Heading>
              <Panel.Body className="panel-small padding-0">
                <ListGroup>
                  {topBeers}
                </ListGroup>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <ConsumationModal brands={state.brands}
          servings={state.servings}
          isOpen={this.state.consumationModalOpen}
          onBrandChange={this.props.actions.getConsumationBeers}
          onChange={this.onConsumationChange}
          onClose={() => this.setState({ ...this.state, consumationModalOpen: false })}
          onSave={() => this.props.actions.addConsumation(state.consumation.item)}
          consumation={state.consumation} />
        <BeerModal isOpen={this.state.beerModalOpen}
                   brands={state.brands}
                   onChange={this.onBeerChange}
                   onClose={() => this.setState({ ...this.state, beerModalOpen: false })}
                   onSave={() => this.props.actions.addBeer(state.beer)} />
        <BrandModal isOpen={this.state.brandModalOpen}
                    onChange={this.onBrandChange}
                    onClose={() => this.setState({ ...this.state, brandModalOpen: false })}
                    onSave={() => this.props.actions.addBrand(state.brand)} />
      </Grid>
    );
  }
}

BeerPage.propTypes = {
  actions: PropTypes.object.isRequired,
  beer: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    beer: state.beer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BeerPage);
