import React from 'react';
import { Grid, Row, Col, Label, Panel, Table, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap/lib';
import moment from 'moment';
import Moment from 'react-moment';
import _ from 'lodash';
import { boundMethod } from 'autobind-decorator';

import Filters from './Filters';
import ConsumationModal from './ConsumationModal';
import BeerModal from './BeerModal';
import BrandModal from './BrandModal';
import * as beerApi from '../../api/main/beer';
import * as commonApi from '../../api/main/common';
import * as consumationApi from '../../api/main/consumation';
import { Consumation, Beer, Brand, ConsumationFilters, Serving } from 'types/beer';
import { Pagination } from '../../components/common';
import { Page } from '../Page';

type Props = {}

type State = {
    beerCount: number,
    brandCount: number,
    beers: Beer[],
    beer: Beer,
    brand: Brand,
    brands: Brand[],
    beerModalOpen: boolean,
    brandModalOpen: boolean,
    consumationModalOpen: boolean,
    consumation: Consumation,
    consumations: {
        count: number,
        items: Consumation[]
    },
    filters: ConsumationFilters,
    newBeers: any,
    servings: Serving[],
    sum: number,
    topBeers: Beer[]
}

class BeerPage extends Page<Props, State> {

    state: State = {
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
            from: moment().month(0).date(1).format("YYYY-MM-DD"),
            page: 1,
            pageSize: 10
        },
        newBeers: {
            count: 0,
            items: []
        },
        servings: [],
        sum: 0,
        topBeers: []
    };

    @boundMethod
    addBeer() {
        beerApi.postBeer(this.state.beer.brandId, this.state.beer).then(() => { });
    }

    @boundMethod
    addBrand() {
        beerApi.postBrand(this.state.brand.name).then(() => {
            this.setState({ brandModalOpen: false });
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
        beerApi.getBrands()
            .then(brands => this.setState({ brands }, () => this.onConsumationBrandChange(brands[0].id)));

        commonApi.getBeerServing()
            .then(servings => this.setState({ servings }, () => this.onConsumationChange({ servingId: servings[0].id })));
    }

    @boundMethod
    onBeerChange(beerValue: Partial<Beer>) {
        this.setState({
            beer: {
                ...this.state.beer,
                ...beerValue
            }
        });
    }

    @boundMethod
    onBrandChange(brandValue: Partial<Brand>) {
        this.setState({
            brand: {
                ...this.state.brand,
                ...brandValue
            }
        });
    }

    @boundMethod
    onConsumationBrandChange(brandId: string) {
        beerApi.get({ brandId }).then(data => this.setState({
            beers: data.items,
            consumation: {
                ...this.state.consumation,
                beerId: data.items[0].id
            }
        }));
    }

    @boundMethod
    onConsumationChange(consumationValue: Partial<Consumation>) {
        this.setState({
            consumation: {
                ...this.state.consumation,
                ...consumationValue
            }
        });
    }

    @boundMethod
    onFiltersChange(filterValue?: Partial<ConsumationFilters>) {
        const filters = this.resolveFilters(this.state.filters, filterValue);
        this.pushHistoryState(filters);

        this.setState({ ...this.state, filters });

        const statsFilters = {
            ...filters,
            page: 1,
            pageSize: 5
        };

        consumationApi.getSum(statsFilters)
            .then(sum => this.setState({ sum }))

        consumationApi.getSumByBeer(statsFilters)
            .then(beers => this.setState({ topBeers: beers.items }));

        consumationApi.getNewBeers(statsFilters)
            .then(newBeers => this.setState({ newBeers }));

        consumationApi.get(filters).then(consumations => {
            consumationApi.getCountBeer(statsFilters).then(beerCount => {
                consumationApi.getCountBrand(statsFilters).then(brandCount => {
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
        const consumationRows = this.state.consumations.items.map(consumation => <tr key={_.uniqueId('consumation_row_')}>
            <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
            <td>{consumation.beer.name}</td>
            <td>{consumation.serving}</td>
            <td>{consumation.volume / 1000}L</td>
        </tr>);

        const loadBeers = (inputValue, callback) => {
            beerApi.get({ search: inputValue }).then(beers => callback(beers.items.map(beer => { return { value: beer.id, label: beer.name } })));
        };

        const topBeers = this.state.topBeers.map(beer => (
            <ListGroupItem key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.by.name} <span className="pull-right"><Label bsStyle="primary">{beer.sum / 1000}L</Label></span>
            </ListGroupItem>
        ));

        const newBeers = this.state.newBeers.items.map(beer => (
            <ListGroupItem key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.name}
            </ListGroupItem>
        ));

        const { consumations, filters } = this.state;

        const sum = Math.ceil(this.state.sum / 1000);

        const from = moment(this.state.filters.from);
        const to = this.state.filters.to ? moment(this.state.filters.to) : moment();

        const perDay = (sum / (1 + to.diff(from, 'days'))).toFixed(2);

        const pages = Math.ceil(consumations.count / filters.pageSize);

        return (
            <Grid>
                <Row>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Filters</Panel.Heading>
                            <Panel.Body>
                                <Filters filters={this.state.filters}
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
                                                Consumations ({consumations.count})
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
                                                {consumationRows}
                                            </tbody>
                                        </Table>
                                        <Pagination
                                            page={filters.page}
                                            pages={pages}
                                            onPageChange={page => this.onFiltersChange({ page })}
                                        />
                                    </Panel.Body>
                                    <Panel.Footer>
                                        Beers {this.state.beerCount} Brands {this.state.brandCount} Sum ~{sum}L Per day ~{perDay}L
                                    </Panel.Footer>
                                </Panel>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>
                                Top Beers
                            </Panel.Heading>
                            <Panel.Body className="panel-small padding-0">
                                <ListGroup>
                                    {topBeers}
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>
                                New Beers ({`${this.state.newBeers.count}`})
                            </Panel.Heading>
                            <Panel.Body className="panel-small padding-0">
                                <ListGroup>
                                    {newBeers}
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
                    loadBeers={loadBeers}
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
