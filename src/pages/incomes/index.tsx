import React from "react";
import { Badge, Button, Card, Col, Container, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import moment from "moment";
import FontAwesome from 'react-fontawesome';

import api from '~api/main';
import { DistributionCard } from '~components/DistributionCard';
import { FormattedNumber } from "~components/FormattedNumber";
import Pagination from '~components/Pagination';
import Select from '~components/Select';
import { GroupByTime } from '~consts/groupings';
import { UserContext } from '~contexts/user-context';
import { Page } from '~pages/Page';
import { Income, IncomeBinding, IncomeFilters, IncomeSource, IncomeType } from 'types/incomes';
import { PagedItems } from 'types/paging';
import { KeyValuePair } from "types/grouping";
import IncomeModal from './IncomeModal';

const sumByOptions = [
    { value: GroupByTime.ByYear, name: 'Year' },
];

const maps = {
    [GroupByTime.ByYear]: api.income.getSumByYear,
}

interface Props {
}

interface State {
    currencies: Currency[];
    filters: IncomeFilters;
    groupBy: GroupByTime;
    income: IncomeBinding;
    incomes: PagedItems<Income>;
    isModalOpen: boolean;
    sources: IncomeSource[];
    sum: number;
    sumByTime: KeyValuePair<number>[];
    types: IncomeType[];
}

class IncomesPage extends Page<Props, State> {
    state: State = {
        currencies: [],
        filters: {
            page: 1,
            pageSize: 10,
        },
        groupBy: GroupByTime.ByYear,
        income: {
            amount: 0,
        },
        incomes: {
            count: 0,
            items: []
        },
        isModalOpen: false,
        sources: [],
        sum: 0,
        sumByTime: [],
        types: [],
    };

    componentDidMount() {
        api.currency.get()
            .then(currencies => this.setState({ currencies }));
        api.income.getSources()
            .then(sources => this.setState({ sources }));
        api.common.getIncomeTypes()
            .then(types => this.setState({ types }));
        this.onFiltersChanged();
    }

    render() {
        const { filters, income, incomes, sources, sum, types } = this.state;
        const user = this.context;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filters</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <FormLabel>Type</FormLabel>
                                    <Select options={types} onChange={typeId => this.onFiltersChanged({ typeId })} />
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col xs={10}>
                                        Incomes ({incomes.count})
                                    </Col>
                                    <Col xs={2}>
                                        <Button
                                            className="pull-right"
                                            variant="primary"
                                            size="sm"
                                            onClick={() => this.setState({ isModalOpen: true })}
                                        >
                                            <FontAwesome name="plus" /> New
                                            </Button>
                                    </Col>
                                </Row></Card.Header>
                            <Card.Body>
                                <Table responsive>
                                    <tbody>
                                        {incomes.items.map(income =>
                                            <tr>
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
    }

    onGroupByChanged = (groupBy?: GroupByTime) => {
        if (groupBy) {
            this.setState({ groupBy });
        }
        maps[groupBy ?? this.state.groupBy](this.state.filters).then(sumByTime => this.setState({ sumByTime }));
    }

    onIncomeChanged = (changed: Partial<IncomeBinding>) => {
        this.setState({
            income: {
                ...this.state.income,
                ...changed,
            }
        });
    }

    onModalSave = () => api.income.post(this.state.income)
        .then(() => this.onFiltersChanged());
}

IncomesPage.contextType = UserContext;

export default IncomesPage;