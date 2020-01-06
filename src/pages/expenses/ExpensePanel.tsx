import React from 'react';
import { Button, Col, Panel, Row } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import { Currency, Expense } from 'types/expenses';
import { PagedItems, PagingFilters } from 'types/paging';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import ExpenseTable from './ExpenseTable';

type Props = PagingFilters & {
  expenses: PagedItems<Expense>,
  defaultCurrency: Currency,
  isLoading: boolean,
  onEdit: () => void,
  onNewClick: () => void,
  onPageChange: () => void,
  onUnlink: () => void,
  page: number,
  pageSize: number,
  serverPaging: boolean,
  stats: any,
};

const ExpensePanel = ({ defaultCurrency, expenses, isLoading, onEdit, onNewClick, onPageChange, onUnlink, page, pageSize, serverPaging, stats }: Props) => {

  const expensesHeader = `Expenses (${expenses.count})`;

  const items = serverPaging ? expenses.items : expenses.items.slice((page - 1) * pageSize, page * pageSize);

  const count = serverPaging ? expenses.count : expenses.items.length;

  const expenseTable = items && items.length > 0 ? <ExpenseTable expenses={items} onEdit={onEdit} onUnlink={onUnlink} /> : <h2>No data</h2>;

  return (
    <Panel>
      <Panel.Heading>
        <Row>
          <Col xs={10}>
            {expensesHeader}
          </Col>
          <Col xs={2}>
            {onNewClick &&
              <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={onNewClick}><FontAwesome name="plus" /> New</Button>
            }
          </Col>
        </Row>
      </Panel.Heading>
      <Panel.Body>
        <Row>
          <Col lg={12}>
            {isLoading ? <Spinner /> : expenseTable}
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
      </Panel.Body>
      {stats &&
        <Panel.Footer>
          Sum {stats.sum}{defaultCurrency.symbol} Types {stats.typeCount} Vendors {stats.vendorCount}
        </Panel.Footer>}
    </Panel>
  );
};

export default ExpensePanel;
