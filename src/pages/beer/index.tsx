import React from 'react';
import { Grid, Row, Col, Label, Panel, Table, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap/lib';
import moment from 'moment';
import Moment from 'react-moment';
import _ from 'lodash';
import { boundMethod } from 'autobind-decorator';

import * as urlHelper from '../../utils/urlHelper';
import ConsumationFilters from './ConsumationFilters';
import ConsumationModal from './ConsumationModal';
import BeerModal from './BeerModal';
import BrandModal from './BeerModal';
import * as beerApi from '../../api/main/beer';
import * as commonApi from '../../api/main/common';
import * as consumationApi from '../../api/main/consumation';

class BeerPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      beerCount: 0,
      brandCount: 0,
      beers: [],
      beer: {},
      brand: {},
      brands: [],
      beerModalOpen: false,
      brandModalOpen: false,
      consumationModalOpen: false,
      consumation: {
        date: moment().format("YYYY-MM-DD")
      },
      consumations: {
        count: 0,
        items: []
      },
      filters: {
        from: moment().month(0).date(1).format("YYYY-MM-DD")
      },
      servings: [],
      sum: 0,
      topBeers: []
    };

    beerApi.getBrands()
      .then(brands => this.setState({ brands }, () => this.onConsumationBrandChange(brands[0].id)));

    commonApi.getBeerServing()
      .then(servings => this.setState({ servings }, () => this.onConsumationChange({ servingId: servings[0].id })));
  }

  @boundMethod
  addBeer() {
    beerApi.postBeer(this.state.beer.brandId, this.state.beer).then(() => {
    });
  }

  @boundMethod
  addBrand() {
    beerApi.postBrand(this.state.brand.name).then(() => {
    });
  }

  @boundMethod
  addConsumation() {
    consumationApi.post(this.state.consumation)
      .then(() => this.onFiltersChange());
    this.setState({ consumationModalOpen: false });
  }

  componentDidMount() {
    this.onFiltersChange();
  }

  @boundMethod
  onBeerChange(beerValue) {
    this.setState({
      beer: {
        ...this.state.beer,
        ...beerValue
      }
    });
  }

  @boundMethod
  onBrandChange(brandValue) {
    this.setState({
      brand: {
        ...this.state.brand,
        ...brandValue
      }
    });
  }

  @boundMethod
  onConsumationBrandChange(brandId) {
    beerApi.get({ brandId }).then(data => this.setState({
      beers: data.items,
      consumation: {
        ...this.state.consumation,
        beerId: data.items[0].id
      }
    }));
  }

  @boundMethod
  onConsumationChange(consumationValue) {
    this.setState({
      consumation: {
        ...this.state.consumation,
        ...consumationValue
      }
    });
  }

  @boundMethod
  onFiltersChange(filterValue) {
    const filters = filterValue ? { ...this.state.filters, ...filterValue } : { ...this.state.filters, ...(urlHelper.queryStringToJson(window.location.search)) };
    window.history.pushState(null, null, window.location.pathname + urlHelper.jsonToQueryString(filters));

    this.setState({ ...this.state, filters: filters });

    consumationApi.getSum(filters)
      .then(sum => this.setState({ sum }))

    consumationApi.getSumByBeer({ ...filters, pageSize: 5 })
      .then(beers => {
        this.setState({
          topBeers: beers.items
        });
      });

    consumationApi.get(filters).then(consumations => {
      consumationApi.getCountBeer(filters).then(beerCount => {
        consumationApi.getCountBrand(filters).then(brandCount => {
          this.setState({
            beerCount,
            brandCount,
            consumations
          });
        });
      });
    });
  }

  render() {
    const consumations = this.state.consumations.items.map(consumation => <tr key={_.uniqueId('consumation_row_')}>
      <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
      <td>{consumation.beer.name}</td>
      <td>{consumation.serving}</td>
      <td>{consumation.volume / 1000}L</td>
    </tr>);

    const topBeers = this.state.topBeers.map(beer => (
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
                  servings={this.state.servings}
                  brands={this.state.brands} />
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
                        Consumations ({this.state.consumations.count})
                      </Col>
                      <Col xs={2}>
                        <DropdownButton id={_.uniqueId('dropdown_button_')} title="New" bsStyle="primary" bsSize="xsmall" className="pull-right">
                          <MenuItem eventKey="1" onClick={() => this.setState({ consumationModalOpen: true })}>Consumation</MenuItem>
                          <MenuItem eventKey="2" onClick={() => this.setState({ beerModalOpen: true })}>Beer</MenuItem>
                          <MenuItem eventKey="3" onClick={() => this.setState({ brandModalOpen: true })}>Brand</MenuItem>
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
                    Beers {this.state.beerCount} Brands {this.state.brandCount} Sum ~{Math.ceil(this.state.sum / 1000)}L
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
          brands={this.state.brands}
          beers={this.state.beers}
          consumation={this.state.consumation}
          servings={this.state.servings}
          isOpen={this.state.consumationModalOpen}
          onBrandChange={this.onConsumationBrandChange}
          onChange={this.onConsumationChange}
          onClose={() => this.setState({ consumationModalOpen: false })}
          onSave={this.addConsumation} />
        <BeerModal
          isOpen={this.state.beerModalOpen}
          brands={this.state.brands}
          onChange={this.onBeerChange}
          onClose={() => this.setState({ beerModalOpen: false })}
          onSave={this.addBeer} />
        <BrandModal
          isOpen={this.state.brandModalOpen}
          onChange={this.onBrandChange}
          onClose={() => this.setState({ brandModalOpen: false })}
          onSave={this.addBrand} />
      </Grid>
    );
  }
}

export default BeerPage;
