import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Container, ListGroup, Card, Row, Button } from 'react-bootstrap';

import api from 'api/main';
import { ConsumationFilters } from 'types/beer';
import { DistributionCard, FlagIcon, SmartScroll } from 'components';
import { Page } from '../page';
import BeerModal from './beer-modal';
import BrandModal from './brand-modal';
import ConsumationModal from './consumation-modal';
import { Filters } from './filters';
import { SumByServingChart } from './sum-by-serving-chart';
import { GroupByTime } from 'consts/groupings';
import { Country, KeyValue } from 'types/common';
import { VolumeBadge } from './volume-badge';
import { Unit } from 'consts/units';
import DayConsumations from './day-consumations';
import CountryMapModal from './country-map-modal';
import { components } from 'types/ivy-types';
import CalendarModal from './calendar-modal';
import { KeyValuePair } from 'types/grouping';

type Beer = components['schemas']['Beer'];
type BeerBrand = components['schemas']['BeerBrand'];
type BeerServing = components['schemas']['BeerServing'];
type BeerStyle = components['schemas']['BeerStyle'];
type Consumation = components['schemas']['Consumation'];

interface Props {
    toast: (title: string, message: string) => void;
}

interface State {
    beerCount: number;
    brandCount: number;
    beers: Beer[];
    beer: Beer;
    brand: BeerBrand;
    brands: BeerBrand[];
    beerModalOpen: boolean;
    brandModalOpen: boolean;
    calendarModalOpen: boolean;
    countryMapModalOpen: boolean;
    callOngoing: boolean;
    chartCountData: any;
    consumationModalOpen: boolean;
    consumation: Consumation;
    consumations: {
        count: number,
        items: Consumation[],
    };
    countBy: GroupByTime;
    countries: Country[];
    filters: ConsumationFilters;
    newBeers: any;
    servings: BeerServing[];
    styles: BeerStyle[];
    sum: number;
    sumChartData: any;
    sumByCountry: KeyValue<Country, number>[];
    sumByDay?: KeyValuePair<number>[];
    sumByGrouping: GroupBeerBy;
    sumByServing: any;
    topBeers: Beer[];
}

enum GroupBeerBy {
    ByDayOfWeek = GroupByTime.ByDayOfWeek,
    ByMonth = GroupByTime.ByMonth,
    ByMonthOfYear = GroupByTime.ByMonthOfYear,
    ByYear = GroupByTime.ByYear,
    AlcoholByYear = 5,
}

const sumByOptions = [
    { value: GroupBeerBy.ByMonthOfYear, name: 'Month of Year' },
    { value: GroupBeerBy.ByMonth, name: 'Month' },
    { value: GroupBeerBy.ByDayOfWeek, name: 'Day of Week' },
    { value: GroupBeerBy.ByYear, name: 'Year' },
    { value: GroupBeerBy.AlcoholByYear, name: 'Alcohol by year' },
];

const sumApiMapping = {
    [GroupBeerBy.ByDayOfWeek]: api.consumation.getSumByDayOfWeek,
    [GroupBeerBy.ByMonth]: api.consumation.getSumByMonth,
    [GroupBeerBy.ByMonthOfYear]: api.consumation.getSumByMonthOfYear,
    [GroupBeerBy.ByYear]: api.consumation.getSumByYear,
    [GroupBeerBy.AlcoholByYear]: api.consumation.getAlcoholByYear,
};

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
        calendarModalOpen: false,
        chartCountData: [],
        consumationModalOpen: false,
        consumation: {},
        consumations: {
            count: 0,
            items: [],
        },
        countBy: GroupBeerBy.ByMonthOfYear,
        countries: [],
        countryMapModalOpen: false,
        filters: {
            from: moment().month(0).date(1).format('YYYY-MM-DD'),
            page: 1,
        },
        newBeers: {
            count: 0,
            items: [],
        },
        servings: [],
        styles: [],
        sum: 0,
        sumChartData: [],
        sumByCountry: [],
        sumByGrouping: GroupBeerBy.ByMonthOfYear,
        sumByServing: [],
        topBeers: [],
    };

    componentDidMount() {
        this.onFiltersChange();
        this.loadBrands();

        api.country
            .getAll()
            .then(response => this.setState({ countries: response.items }));

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
        const { brands, countries, callOngoing, consumations, filters, servings, styles, sumByDay, sumByCountry } = this.state;

        const consumationsByDay = _.groupBy(consumations.items, consumation => consumation.date);
        const days = Object.keys(consumationsByDay);

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <Filters
                                    brands={brands}
                                    countries={countries}
                                    filters={filters}
                                    servings={servings}
                                    styles={styles}
                                    onChange={this.onFiltersChange}
                                />
                            </Card.Body>
                        </Card>
                        <div className="form-grid">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.setState({ consumationModalOpen: true })}>
                                Consumation
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.setState({ brandModalOpen: true })}>
                                Brand
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.setState({ beerModalOpen: true })}>
                                Beer
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.setState({ calendarModalOpen: true })}>
                                Calendar
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <Row>
                            <Col lg={12}>
                                <SmartScroll
                                    dataLength={consumations.items.length}
                                    hasMore={consumations.items.length < consumations.count}
                                    onLoadMore={this.getNextPage}
                                >
                                    {days.map(day =>
                                        <DayConsumations
                                            key={day}
                                            day={day}
                                            consumations={consumationsByDay[day]}
                                        />
                                    )}
                                </SmartScroll>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>
                        <DistributionCard
                            countByOptions={sumByOptions}
                            data={this.state.sumChartData}
                            name="Sum"
                            unit="L"
                            unitType={Unit.Volume}
                            onGroupByChange={this.onCountGroupByChange}
                        />
                        <Card>
                            <Card.Header>Top Beers</Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup>
                                    {this.state.topBeers.map(beer =>
                                        <ListGroup.Item key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                                            {beer.key.name} <span className="pull-right"><VolumeBadge volume={beer.value} /></span>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>New Beers ({this.state.newBeers.count})</Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup>
                                    {this.state.newBeers.items.map(beer =>
                                        <ListGroup.Item key={_.uniqueId('list_item_top_beer_')} className="list-group-item border-no-radius border-no-left border-no-right">
                                            {beer.name}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header onClick={() => this.setState({ countryMapModalOpen: true })}>Top Countries</Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup>
                                    {sumByCountry.slice(0, 5).map(country =>
                                        <ListGroup.Item key={_.uniqueId('list_item_top_country_')} className="list-group-item border-no-radius border-no-left border-no-right">
                                            <FlagIcon
                                                code={country.key.id}
                                                country={country.key.name}
                                            />
                                            &nbsp;{country.key.name} <span className="pull-right"><VolumeBadge volume={country.value} /></span>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
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
                    countries={countries}
                    isOpen={this.state.brandModalOpen}
                    onChange={this.onBrandChange}
                    onClose={() => this.setState({ brandModalOpen: false })}
                    onSave={this.addBrand}
                />
                <CountryMapModal
                    isOpen={this.state.countryMapModalOpen}
                    sumByCountry={sumByCountry}
                    onClose={() => this.setState({ countryMapModalOpen: false })}
                />
                {sumByDay &&
                    <CalendarModal dates={sumByDay} isOpen={this.state.calendarModalOpen} onClose={() => this.setState({ calendarModalOpen: false })} />
                }
            </Container>
        );
    }

    addBeer = () => {
        api.beer
            .postBeer(this.state.beer.brandId, this.state.beer)
            .then(() => {
                this.props.toast('Success', 'Beer addeed');
            });
    };

    addBrand = () => {
        api.beer
            .postBrand(this.state.brand)
            .then(() => {
                this.loadBrands();
                this.setState({ brandModalOpen: false });
                this.props.toast('Success', 'Brand addeed');
            });
    };

    addConsumation = () => {
        this.setState({ callOngoing: true });
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
    };

    getNextPage = () => {
        this.onFiltersChange({
            page: this.state.filters.page + 1
        });
    };

    loadBrands = () => {
        api.beer
            .getBrands()
            .then(brands => this.setState({ brands }));
    };

    onBeerChange = (beerValue: Partial<Beer>) => {
        this.setState({
            beer: {
                ...this.state.beer,
                ...beerValue,
            },
        });
    };

    onBrandChange = (brandChanged: Partial<Brand>) => {
        this.setState({
            brand: {
                ...this.state.brand,
                ...brandChanged,
            },
        });
    };

    onConsumationChange = (consumationValue: Partial<Consumation>) => {
        this.setState({
            consumation: {
                ...this.state.consumation,
                ...consumationValue,
            },
        });
    };

    onCountByClick = (groupBy?: GroupByTime) => {
        if (groupBy) {
            this.setState({ countBy: groupBy });
        }
        else {
            groupBy = this.state.countBy;
        }

        let apiMethod;
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
    };

    onFiltersChange = (filterValue?: Partial<ConsumationFilters>) => {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        const state = { ...filters };
        delete state.page;
        delete state.pageSize;

        this.pushHistoryState(state);

        this.setState({ filters }, () => {
            this.onCountByClick();
            this.onCountGroupByChange();
        });

        const pageChanged = !!filterValue?.page;

        api.consumation
            .get(filters)
            .then(consumations => this.setState({
                consumations: {
                    count: consumations.count,
                    items: pageChanged ? [...this.state.consumations.items, ...consumations.items] : consumations.items,
                }
            }));

        if (pageChanged) {
            return;
        }

        const statsFilters = {
            ...filters,
            page: 1,
            pageSize: 5,
        };

        const sumByCountryFilters = {
            ...filters,
            pageAll: true,
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
            .then(data => this.setState({ sumByServing: data.map(x => ({ name: x.key.name, value: x.value })) }));

        api.consumation
            .getSumByCountry(sumByCountryFilters)
            .then(countries => this.setState({ sumByCountry: countries.items }));

        api.consumation
            .getSumByDay(statsFilters)
            .then(sumByDay => this.setState({ sumByDay }));

        this.onCountGroupByChange(this.state.sumByGrouping);
    };

    onCountGroupByChange = (sumByGrouping?: GroupBeerBy) => {
        if (sumByGrouping) {
            this.setState({ sumByGrouping });
        }
        sumApiMapping[sumByGrouping ?? this.state.sumByGrouping](this.state.filters).then(sumChartData => this.setState({ sumChartData }));
    };
}

export default BeerPage;
