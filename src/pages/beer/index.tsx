import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, DropdownButton, Container, Badge, ListGroup, Card, Row, Table, Dropdown } from 'react-bootstrap';

import { Beer, Brand, Consumation, ConsumationFilters, Serving, Style } from 'types/beer';
import api from '../../api/main';
import { Pagination, RadioLabel, SimpleBarChart } from '../../components';
import { Page } from '../Page';
import BeerModal from './BeerModal';
import BrandModal from './BrandModal';
import ConsumationModal from './ConsumationModal';
import { Filters } from './Filters';
import { SumByServingChart } from './SumByServingChart';
import { GroupByTime } from '../../consts/groupings';

interface Props {
    toast: (title: string, message: string) => void;
}

interface State {
    beerCount: number;
    brandCount: number;
    beers: Beer[];
    beer: Beer;
    brand: Brand;
    brands: Brand[];
    beerModalOpen: boolean;
    brandModalOpen: boolean;
    callOngoing: boolean;
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
    styles: Style[];
    sum: number;
    sumByServing: any;
    topBeers: Beer[];
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
        callOngoing: false,
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
        styles: [],
        sum: 0,
        sumByServing: [],
        topBeers: [],
    };

    componentDidMount() {
        this.onFiltersChange();
        this.loadBrands();

        api.common
            .getBeerServing()
            .then(servings => {
                this.setState({ servings });
                this.onConsumationChange({ servingId: servings[0].id });
            });

        api.common
           .getBeerStyles()
           .then(styles => this.setState({ styles }));
    }

    render() {
        const countByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
        ];

        const consumationRows = this.state.consumations.items.map(consumation => <tr key={_.uniqueId('consumation_row_')}>
            <td>{moment(consumation.date).format('Do MMMM YYYY')}</td>
            <td>{consumation.beer.name}</td>
            <td>{consumation.serving}</td>
            <td>{consumation.volume / 1000}L</td>
        </tr>);

        const topBeers = this.state.topBeers.map(beer => (
            <ListGroup.Item key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.by.name} <span className="pull-right"><Badge variant="primary" title={`${beer.sum / 1000}L`}>{Math.ceil(beer.sum / 1000)}L</Badge></span>
            </ListGroup.Item>
        ));

        const newBeers = this.state.newBeers.items.map(beer => (
            <ListGroup.Item key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                {beer.name}
            </ListGroup.Item>
        ));

        const { brands, callOngoing, consumations, filters, servings, styles } = this.state;

        const sum = Math.ceil(this.state.sum / 1000);

        const from = moment(filters.from);
        const to = filters.to ? moment(filters.to) : moment();

        const perDay = (sum / (1 + to.diff(from, 'days'))).toFixed(2);

        const pages = Math.ceil(consumations.count / filters.pageSize);

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <Filters
                                    brands={brands}
                                    filters={filters}
                                    servings={servings}
                                    styles={styles}
                                    onChange={this.onFiltersChange}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col xs={10}>
                                                Consumations ({consumations.count})
                                            </Col>
                                            <Col xs={2}>
                                                <DropdownButton id={_.uniqueId('dropdown_button_')} title="New" variant="primary" size="sm" className="pull-right">
                                                    <Dropdown.Item onClick={() => this.setState({ consumationModalOpen: true })}>Consumation</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.setState({ beerModalOpen: true })}>Beer</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.setState({ brandModalOpen: true })}>Brand</Dropdown.Item>
                                                </DropdownButton>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
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
                                    </Card.Body>
                                    <Card.Footer>
                                        Beers {this.state.beerCount} Brands {this.state.brandCount} Sum ~{sum}L Per day ~{perDay}L
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>Count</Card.Header>
                                    <Card.Body>
                                        <SimpleBarChart
                                            data={this.state.chartCountData}
                                            name="key"
                                            value="value"
                                        />
                                    </Card.Body>
                                    <Card.Footer>
                                        <RadioLabel options={countByOptions} onSelect={this.onCountByClick} />
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Top Beers</Card.Header>
                            <ListGroup>
                                {topBeers}
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header>New Beers ({this.state.newBeers.count})</Card.Header>
                            <ListGroup>
                                {newBeers}
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header>By Serving</Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <SumByServingChart data={this.state.sumByServing} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <ConsumationModal
                    brands={this.state.brands}
                    beers={this.state.beers}
                    consumation={this.state.consumation}
                    disabled={callOngoing}
                    isOpen={this.state.consumationModalOpen}
                    servings={this.state.servings}
                    onBrandChange={this.onConsumationBrandChange}
                    onChange={this.onConsumationChange}
                    onClose={() => this.setState({ consumationModalOpen: false })}
                    onSave={this.addConsumation}
                />
                <BeerModal
                    isOpen={this.state.beerModalOpen}
                    brands={brands}
                    styles={styles}
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
            </Container>
        );
    }

    @boundMethod
    private addBeer() {
        api.beer
            .postBeer(this.state.beer.brandId, this.state.beer)
            .then(() => {
                this.props.toast('Success', 'Beer addeed');
            });
    }

    @boundMethod
    private addBrand() {
        api.beer
            .postBrand(this.state.brand.name)
            .then(() => {
                this.loadBrands();
                this.setState({ brandModalOpen: false });
                this.props.toast('Success', 'Brand addeed');
            });
    }

    @boundMethod
    private addConsumation() {
        this.setState({callOngoing: true});
        api.consumation
            .post(this.state.consumation)
            .then(() => {
                this.onFiltersChange();
                this.setState({
                    callOngoing: false,
                    consumationModalOpen: false,
                });
                this.props.toast('Success', 'Consumation addeed');
            });
    }

    @boundMethod
    private loadBrands() {
        api.beer
            .getBrands()
            .then(brands => this.setState({ brands }));
    }

    @boundMethod
    private onBeerChange(beerValue: Partial<Beer>) {
        this.setState({
            beer: {
                ...this.state.beer,
                ...beerValue,
            },
        });
    }

    @boundMethod
    private onBrandChange(brandValue: Partial<Brand>) {
        this.setState({
            brand: {
                ...this.state.brand,
                ...brandValue,
            },
        });
    }

    @boundMethod
    private onConsumationChange(consumationValue: Partial<Consumation>) {
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
    private onFiltersChange(filterValue?: Partial<ConsumationFilters>) {
        const filters = this.resolveFilters(this.state.filters, filterValue);
        this.pushHistoryState(filters);

        this.setState({ filters }, this.onCountByClick);
        console.log(filters);

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
            .getCountBrand(statsFilters)
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
            .then(data => this.setState({ sumByServing: data.items.map(x => ({ name: x.by.name, value: x.sum }))}));
    }
}

export default BeerPage;
