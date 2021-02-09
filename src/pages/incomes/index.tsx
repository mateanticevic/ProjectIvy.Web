import React from "react";
import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import moment from "moment";

import api from '../../api/main';
import { Page } from "../Page";
import { Income, IncomeFilters } from 'types/incomes';
import { PagedItems } from 'types/paging';
import Pagination from '../../components/Pagination';

interface Props {

}

interface State {
    filters: IncomeFilters;
    incomes: PagedItems<Income>;
}

class IncomesPage extends Page<Props, State> {
    state: State = {
        filters: {
            page: 1,
            pageSize: 10,
        },
        incomes: {
            count: 0,
            items: []
        }
    };

    componentDidMount() {
        this.onFiltersChanged();
    }

    render() {
        const { filters, incomes } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={6}>
                        <Card>
                            <Card.Header>Incomes ({incomes.count})</Card.Header>
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
                    </Col>
                </Row>
            </Container>
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
    }
}

export default IncomesPage;