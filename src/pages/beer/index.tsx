import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, DropdownButton, Grid, Label, ListGroup, ListGroupItem, MenuItem, Panel, Row, Table } from 'react-bootstrap/lib';
import Moment from 'react-moment';
import { toast } from 'react-toastify';

import { Beer, Brand, Consumation, ConsumationFilters, Serving } from 'types/beer';
import api from '../../api/main';
import { Pagination, RadioLabel, SimpleBarChart } from '../../components';
import { Page } from '../Page';
import BeerModal from './BeerModal';
import BrandModal from './BrandModal';
import ConsumationModal from './ConsumationModal';
import Filters from './Filters';
import { SumByServingChart } from './SumByServingChart';
import { GroupByTime } from '../../consts/groupings';

interface State {
    beerCount: number;
    brandCount: number;
    beers: Beer[];
    beer: Beer;
    brand: Brand;
    brands: Brand[];
    beerModalOpen: boolean;
    brandModalOpen: boolean;
    chartCountData: any;
    consumationModalOpen: boolean;
    consumation: Consumation;
    consumations: {
        count: number,
        items: Consumation[],
    };
    countBy: GroupByTime;
    filters: ConsumationFilters;
    newBeers: any;
    servings: Serving[];
    sum: number;
    sumByServing: any;
    topBeers: Beer[];
}

class BeerPage extends Page<{}, State> {

    public state: State = {
        beerCount: 0,
        brandCount: 0,
        beers: [],
        beer: {},
        brand: {},
        brands: [],
        beerModalOpen: false,
        brandModalOpen: false,
        chartCountData: [],
        consumationModalOpen: false,
        consumation: {
            date: moment().format('YYYY-MM-DD'),
        },
        consumations: {
            count: 0,
            items: [],
        },
        countBy: GroupByTime.ByMonthOfYear,
        filters: {
            from: moment().month(0).date(1).format('YYYY-MM-DD'),
            page: 1,
            pageSize: 10,
        },
        newBeers: {
            count: 0,
            items: [],
        },
        servings: [],
        sum: 0,
        sumByServing: [],
        topBeers: [],
    };

    @boundMethod
    public addBeer() {
        api.beer
            .postBeer(this.state.beer.brandId, this.state.beer)
            .then(() => {
                toast.success('Beer added');
            });
    }

    @boundMethod
    public addBrand() {
        api.beer
            .postBrand(this.state.brand.name)
            .then(() => {
                this.loadBrands();
                this.setState({ brandModalOpen: false });
                toast.success('Brand added');
            });
    }

    @boundMethod
    public addConsumation() {
        api.consumation
            .post(this.state.consumation)
            .then(() => {
                this.onFiltersChange();
                this.setState({ consumationModalOpen: false });
                toast.success('Consumation added');
            });
    }

    public componentDidMount() {
        this.onFiltersChange();
        this.loadBrands();

        api.common
            .getBeerServing()
            .then(servings => {
                this.setState({ servings });
                this.onConsumationChange({ servingId: servings[0].id });
            });
    }

    @boundMethod
    public onBeerChange(beerValue: Partial<Beer>) {
        this.setState({
            beer: {
                ...this.state.beer,
                ...beerValue,
            },
        });
    }

    @boundMethod
    public onBrandChange(brandValue: Partial<Brand>) {
        this.setState({
            brand: {
                ...this.state.brand,
                ...brandValue,
            },
        });
    }

    @boundMethod
    public onConsumationChange(consumationValue: Partial<Consumation>) {
        this.setState({
            consumation: {
                ...this.state.consumation,
                ...consumationValue,
            },
        });
    }

    @boundMethod
    private onCountByClick(groupBy?: GroupByTime) {
        let apiMethod;
        
        if (groupBy) {
            this.setState({ countBy: groupBy });
        }
        else {
            groupBy = this.state.countBy;
        }

        switch (groupBy) {
            case GroupByTime.ByYear:
                apiMethod = api.consumation.getCountByYear;
                break;
            case GroupByTime.ByMonth:
                apiMethod = api.consumation.getCountByMonth;
                break;
            case GroupByTime.ByMonthOfYear:
                apiMethod = api.consumation.getCountByMonthOfYear;
                break;
        }

        apiMethod(this.state.filters)
            .then(chartCountData => this.setState({ chartCountData: _.reverse(chartCountData) }));
    }

    @boundMethod
    public onFiltersChange(filterValue?: Partial<ConsumationFilters>) {
        const filters = this.resolveFilters(this.state.filters, filterValue);
        this.pushHistoryState(filters);

        this.setState({ filters }, this.onCountByClick);

        api.consumation
            .get(filters)
            .then(consumations => this.setState({ consumations }));

        if (filterValue && filterValue.page) {
            return;
        }

        const statsFilters = {
            ...filters,
            page: 1,
            pageSize: 5,
        };

        api.consumation
            .getCountBeer(statsFilters)
            .then(beerCount => this.setState({ beerCount }));

        api.consumation
            .getCountBeer(statsFilters)
            .then(brandCount => this.setState({ brandCount }));

        api.consumation
            .getSum(statsFilters)
            .then(sum => this.setState({ sum }));

        api.consumation
            .getSumByBeer(statsFilters)
            .then(beers => this.setState({ topBeers: beers.items }));

        api.consumation
            .getNewBeers(statsFilters)
            .then(newBeers => this.setState({ newBeers }));

        api.consumation
            .getSumByServing(filters)
            .then(data => this.setState({ sumByServing: data.items.map((x => ({ name: x.by.name, value: x.sum })) }));
    }

    public render() {
        const countByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
        ];

        const consumationRows = this.state.consumations.items.map(consumation => <tr key={_.uniqueId('consumation_row_')}>
            <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
            <td>{consumation.beer.name}</td>
            <td>{consumation.serving}</td>
            <td>{consumation.volume / 1000}L</td>
        </tr>);

        const topBeers = this.state.topBeers.map(beer => (
            <ListGroupItem key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.by.name} <span className="pull-right"><Label bsStyle="primary" title={`${beer.sum / 1000}L`}>{Math.ceil(beer.sum / 1000)}L</Label></span>
            </ListGroupItem>
        ));

        const newBeers = this.state.newBeers.items.map(beer => (
            <ListGroupItem key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.name}
            </ListGroupItem>
        ));

        const { brands, consumations, filters, servings } = this.state;

        const sum = Math.ceil(this.state.sum / 1000);

        const from = moment(filters.from);
        const to = filters.to ? moment(filters.to) : moment();

        const perDay = (sum / (1 + to.diff(from, 'days'))).toFixed(2);

        const pages = Math.ceil(consumations.count / filters.pageSize);

        return (
            <Grid>
                <Row>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Filters</Panel.Heading>
                            <Panel.Body>
                                <Filters
                                    filters={filters}
                                    onChange={this.onFiltersChange}
                                    servings={servings}
                                    brands={brands}
                                />
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
                                <Panel>
                                    <Panel.Heading>
                                        <Panel.Toggle>Count</Panel.Toggle>
                                    </Panel.Heading>
                                    <Panel.Body>
                                        <SimpleBarChart
                                            data={this.state.chartCountData}
                                            name="key"
                                            value="value"
                                        />
                                    </Panel.Body>
                                    <Panel.Footer>
                                        <RadioLabel options={countByOptions} onSelect={this.onCountByClick} />
                                    </Panel.Footer>
                                </Panel>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Top Beers</Panel.Heading>
                            <Panel.Body className="panel-small padding-0">
                                <ListGroup>
                                    {topBeers}
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>New Beers ({this.state.newBeers.count})</Panel.Heading>
                            <Panel.Body className="panel-small padding-0">
                                <ListGroup>
                                    {newBeers}
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>By Serving</Panel.Heading>
                            <Panel.Body className="panel-small padding-0">
                                <SumByServingChart data={this.state.sumByServing} />
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
                    onSave={this.addConsumation}
                />
                <BeerModal
                    isOpen={this.state.beerModalOpen}
                    brands={brands}
                    onChange={this.onBeerChange}
                    onClose={() => this.setState({ beerModalOpen: false })}
                    onSave={this.addBeer}
                />
                <BrandModal
                    isOpen={this.state.brandModalOpen}
                    onChange={this.onBrandChange}
                    onClose={() => this.setState({ brandModalOpen: false })}
                    onSave={this.addBrand}
                />
            </Grid>
        );
    }

    @boundMethod
    private loadBrands() {
        api.beer
            .getBrands()
            .then(brands => this.setState({ brands }));
    }
}

export default BeerPage;
