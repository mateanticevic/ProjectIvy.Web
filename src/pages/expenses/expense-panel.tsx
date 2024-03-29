import React from 'react';
import { Button, Col, Card, Row } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { PagedItems, PagingFilters } from 'types/paging';
import Pagination from 'components/pagination';
import ExpenseTable from './expense-table';
import { components } from 'types/ivy-types';

type Currency = components['schemas']['Currency'];
type Expense = components['schemas']['Expense'];

type Props = PagingFilters & {
    expenses: PagedItems<Expense>,
    defaultCurrency: Currency,
    isLoading: boolean,
    page: number,
    pageSize: number,
    serverPaging: boolean,
    stats: any,
    onEdit: () => void,
    onNewClick: () => void,
    onPageChange: () => void,
    onLink: () => void,
    onUnlink: () => void,
};

const ExpensePanel = ({ defaultCurrency, expenses, isLoading, onEdit, onNewClick, onPageChange, onLink, onUnlink, page, pageSize, serverPaging, stats }: Props) => {

    const expensesHeader = `Expenses (${expenses.count})`;

    const items = serverPaging ? expenses.items : expenses.items.slice((page - 1) * pageSize, page * pageSize);

    const count = serverPaging ? expenses.count : expenses.items.length;

    const expenseTable = items && items.length > 0 || isLoading ? <ExpenseTable expenses={items} onEdit={onEdit} onLink={onLink} onUnlink={onUnlink} isLoading={isLoading} /> : <h2>No data</h2>;

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col xs={10}>
                        {expensesHeader}
                    </Col>
                    <Col xs={2}>
                        {onNewClick &&
                            <Button
                                className="pull-right"
                                variant="primary"
                                size="sm"
                                onClick={onNewClick}
                            >
                                <FontAwesome name="plus" /> New
                            </Button>
                        }
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col lg={12}>
                        {expenseTable}
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <Pagination
                            page={page}
                            pages={Math.ceil(count / pageSize)}
                            onPageChange={onPageChange}
                        />
                    </Col>
                </Row>
            </Card.Body>
            {stats &&
                <Card.Footer>
                    Sum {stats.sum}{defaultCurrency.symbol} Types {stats.typeCount} Vendors {stats.vendorCount}
                </Card.Footer>}
        </Card>
    );
};

export default ExpensePanel;
