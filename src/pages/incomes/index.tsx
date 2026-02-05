import React from 'react';
import { Badge, Button, Card, Col, Container, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

import api from 'api/main';
import { DateFormElement, DistributionCard, FormattedNumber, Pagination, Select } from 'components';
import { GroupByTime } from 'consts/groupings';
import { UserContext } from 'contexts/user-context';
import { Page } from 'pages/page';
import { IncomeFilters } from 'types/incomes';
import { PagedItems } from 'types/paging';
import { KeyValuePair } from 'types/grouping';
import IncomeModal from './income-modal';
import { components } from 'types/ivy-types';
import _ from 'lodash';
import { RiPlayListAddLine } from 'react-icons/ri';

type Currency = components['schemas']['Currency'];
type Income = components['schemas']['Income'];
type IncomeSource = components['schemas']['IncomeSource'];
type IncomeType = components['schemas']['IncomeType'];
type IncomeBinding = components['schemas']['IncomeBinding'];
type User = components['schemas']['User'];

const sumByOptions = [
    { value: GroupByTime.ByMonthOfYear, name: 'Month of year' },
    { value: GroupByTime.ByYear, name: 'Year' },
];

const maps = {
    [GroupByTime.ByMonthOfYear]: api.income.getSumByMonthOfYear,
    [GroupByTime.ByYear]: api.income.getSumByYear,
};

interface State {
    currencies: Currency[];
    filters: IncomeFilters;
    groupBy: GroupByTime;
    income: IncomeBinding;
    incomes: PagedItems<Income>;
    isLoading: boolean;
    isModalOpen: boolean;
    sources: IncomeSource[];
    sum: number;
    sumByTime: KeyValuePair<number>[];
    types: IncomeType[];
}

class IncomesPage extends Page<unknown, State> {

    user = this.context as User;
    state: State = {
        currencies: [],
        filters: {
            from: moment().month(0).date(1).format('YYYY-MM-DD'),
            page: 1,
            pageSize: 10,
        },
        groupBy: GroupByTime.ByMonthOfYear,
        income: {
            amount: 0,
            currencyId: this.user.defaultCurrency?.id,
        },
        incomes: {
            count: 0,
            items: []
        },
        isLoading: true,
        isModalOpen: false,
        sources: [],
        sum: 0,
        sumByTime: [],
        types: [],
    };

    componentDidMount() {
        this.onFiltersChanged();
        Promise.all(
            [api.currency.get().then(currencies => this.setState({ currencies })),
            api.income.getSources().then(sources => this.setState({ sources })),
            api.common.getIncomeTypes().then(types => this.setState({ types }))]
        ).then(() => this.setState({ isLoading: false }));
    }

    render() {
        const { filters, income, incomes, isLoading, sources, sum, types } = this.state;
        const user = this.context as User;

        if (isLoading) {
            return this.renderDefaultSkeleton();
        }

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Body>
                                <div className="form-grid">
                                    <Button onClick={() => this.setState({ isModalOpen: true })}>
                                        <RiPlayListAddLine /> New income
                                    </Button>
                                </div>
                                <FormGroup>
                                    <FormLabel>Type</FormLabel>
                                    <Select options={types} onChange={typeId => this.onFiltersChanged({ typeId })} />
                                </FormGroup>
                                <FormGroup>
                                    <DateFormElement
                                        label="From"
                                        onChange={date => this.onFiltersChanged({ from: date })}
                                        value={filters.from}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <DateFormElement
                                        label="To"
                                        onChange={date => this.onFiltersChanged({ to: date })}
                                        value={filters.to}
                                    />
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card>
                            <Card.Header>Incomes ({incomes.count})</Card.Header>
                            <Card.Body>
                                <Table responsive>
                                    <tbody>
                                        {incomes.items.map(income =>
                                            <tr key={_.uniqueId()}>
                                                <td>{moment(income.timestamp).format('Do MMMM YYYY')}</td>
                                                <td><Badge variant="primary">{income.type.name}</Badge></td>
                                                <td>{income.description}</td>
                                                <td>
                                                    <FormattedNumber number={income.amount} />
                                                </td>
                                                <td>{income.currency.code}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination
                                    page={filters.page}
                                    pages={Math.ceil(incomes.count / filters.pageSize)}
                                    onPageChange={page => this.onFiltersChanged({ page })}
                                />
                            </Card.Body>
                            <Card.Footer>
                                <FormattedNumber number={sum} />&nbsp;{user?.defaultCurrency?.code}
                            </Card.Footer>
                        </Card>
                        <DistributionCard
                            countByOptions={sumByOptions}
                            data={this.state.sumByTime}
                            name="Sum"
                            onGroupByChange={this.onGroupByChanged}
                        />
                        <IncomeModal
                            currencies={this.state.currencies}
                            income={income}
                            isOpen={this.state.isModalOpen}
                            sources={sources}
                            types={types}
                            onClose={() => this.setState({ isModalOpen: false })}
                            onChange={this.onIncomeChanged}
                            onSave={this.onModalSave}
                        />
                    </Col>
                </Row>
            </Container >
        );
    }

    onFiltersChanged = (changed?: Partial<IncomeFilters>) => {
        const filters = changed ? {
            ...this.state.filters,
            ...changed,
        } : this.state.filters;

        this.setState({ filters }, this.onGroupByChanged);
        api.income.get(filters)
            .then(incomes => this.setState({ incomes }));
        api.income.getSum(filters)
            .then(sum => this.setState({ sum }));
    };

    onGroupByChanged = (groupBy?: GroupByTime) => {
        if (groupBy) {
            this.setState({ groupBy });
        }
        maps[groupBy ?? this.state.groupBy](this.state.filters).then(sumByTime => this.setState({ sumByTime }));
    };

    onIncomeChanged = (changed: Partial<IncomeBinding>) => {
        this.setState({
            income: {
                ...this.state.income,
                ...changed,
            }
        });
    };

    onModalSave = () => api.income.post(this.state.income)
        .then(() => this.onFiltersChanged());
}

IncomesPage.contextType = UserContext;

export default IncomesPage;