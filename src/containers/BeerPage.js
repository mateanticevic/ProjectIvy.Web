import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Label, Panel, Table, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap/lib';
import moment from 'moment';
import Moment from 'react-moment';
import _ from 'lodash';

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
      filters: {
        from: moment().month(0).date(1).format("YYYY-MM-DD") // YYYY-01-01
      }
    };

    this.onBeerChange = this.onBeerChange.bind(this);
    this.onBrandChange = this.onBrandChange.bind(this);
    this.onConsumationChange = this.onConsumationChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);

    props.actions.getBrands();
    props.actions.getServings();

    const newConsumation = {
      date: moment().format("YYYY-MM-DD")
    };
    this.props.actions.consumationChange(newConsumation);
  }

  componentDidMount() {
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

    const consumations = state.consumations.items.map(consumation => <tr key={_.uniqueId('consumation_row_')}>
      <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
      <td>{consumation.beer.name}</td>
      <td>{consumation.serving}</td>
      <td>{consumation.volume / 1000}L</td>
    </tr>);

    const topBeers = state.topBeers.map(beer => (
      <ListGroupItem key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
        {beer.by.name} <span className="pull-right"><Label bsStyle="primary">{beer.sum / 1000}L</Label></span>
      </ListGroupItem>
    ));

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
                        <DropdownButton id={_.uniqueId('dropdown_button_')} title="New" bsStyle="primary" bsSize="xsmall" className="pull-right">
                          <MenuItem eventKey="1" onClick={() => this.setState({ ...this.state, consumationModalOpen: true })}>Consumation</MenuItem>
                          <MenuItem eventKey="2" onClick={() => this.setState({ ...this.state, beerModalOpen: true })}>Beer</MenuItem>
                          <MenuItem eventKey="2" onClick={() => this.setState({ ...this.state, brandModalOpen: true })}>Brand</MenuItem>
                        </DropdownButton>
                      </Col>
                    </Row>
                  </Panel.Heading>
                  <Panel.Body>
                    <Table>
                      <tbody>
                        {consumations}
                      </tbody>
                    </Table>
                  </Panel.Body>
                  <Panel.Footer>
                    Beers {state.stats.beers} Brands {state.stats.brands} Sum ~{Math.ceil(state.sum / 1000)}L
                  </Panel.Footer>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                {/* <Panel>
                  <Panel.Heading>
                    By serving
                </Panel.Heading>
                  <Panel.Body>
                  </Panel.Body>
                </Panel> */}
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
        <ConsumationModal
          brands={state.brands}
          consumation={state.consumation}
          servings={state.servings}
          isOpen={this.state.consumationModalOpen}
          onBrandChange={this.props.actions.getConsumationBeers}
          onChange={this.onConsumationChange}
          onClose={() => this.setState({ ...this.state, consumationModalOpen: false })}
          onSave={() => this.props.actions.addConsumation(state.consumation.item)} />
        <BeerModal
          isOpen={this.state.beerModalOpen}
          brands={state.brands}
          onChange={this.onBeerChange}
          onClose={() => this.setState({ ...this.state, beerModalOpen: false })}
          onSave={() => this.props.actions.addBeer(state.beer)} />
        <BrandModal
          isOpen={this.state.brandModalOpen}
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
