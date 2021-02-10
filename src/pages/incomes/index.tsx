import React from "react";
import { Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import moment from "moment";

import { DistributionCard } from '../../components/DistributionCard';
import { GroupByTime } from '../../consts/groupings';
import api from '../../api/main';
import { Page } from "../Page";
import { Income, IncomeFilters, IncomeSource, IncomeType } from 'types/incomes';
import { PagedItems } from 'types/paging';
import Pagination from '../../components/Pagination';
import { KeyValuePair } from "types/grouping";
import IncomeModal from "./IncomeModal";
import FontAwesome from "react-fontawesome";

const sumByOptions = [
    { value: GroupByTime.ByYear, name: 'Year' },
];

const maps = {
    [GroupByTime.ByYear]: api.income.getSumByYear,
}

interface Props {

}

interface State {
    filters: IncomeFilters;
    groupBy: GroupByTime;
    incomes: PagedItems<Income>;
    isModalOpen: boolean;
    sources: IncomeSource[];
    sumByTime: KeyValuePair<number>[];
    types: IncomeType[];
}

class IncomesPage extends Page<Props, State> {
    state: State = {
        filters: {
            page: 1,
            pageSize: 10,
        },
        groupBy: GroupByTime.ByYear,
        incomes: {
            count: 0,
            items: []
        },
        isModalOpen: false,
        sources: [],
        sumByTime: [],
        types: [],
    };

    componentDidMount() {
        api.income.getSources()
            .then(sources => this.setState({ sources }));
        api.common.getIncomeTypes()
            .then(types => this.setState({ types }));
        this.onFiltersChanged();
    }

    render() {
        const { filters, incomes, sources, types } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={3}></Col>
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
                                            <td>{income.amount}</td>
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
                        </Card>
                    <DistributionCard
                        countByOptions={sumByOptions}
                        data={this.state.sumByTime}
                        name="Sum"
                        onGroupByChange={this.onGroupByChanged}
                    />
                    <IncomeModal
                        isOpen={this.state.isModalOpen}
                        sources={sources}
                        types={types}
                        onClose={() => this.setState({ isModalOpen: false })}
                        onChange={() => { }}
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

        this.setState({ filters });
        api.income.get(filters)
            .then(incomes => this.setState({ incomes }));
        this.onGroupByChanged();
    }

    onGroupByChanged = (groupBy?: GroupByTime) => {
        if (groupBy) {
            this.setState({ groupBy });
        }
        maps[groupBy ?? this.state.groupBy](this.state.filters).then(sumByTime => this.setState({ sumByTime }));
    }
}

export default IncomesPage;