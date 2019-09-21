import React from 'react';
import { Row, Col, Panel, Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import ExpenseTable from './ExpenseTable';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import { Expense } from 'types/expenses';
import { PagingFilters, PagedItems } from 'types/paging';

type Props = PagingFilters & {
  expenses: PagedItems<Expense>,
  isLoading: boolean,
  onEdit: () => void,
  onNewClick: () => void,
  onPageChange: () => void,
  onUnlink: () => void,
  serverPaging: boolean,
  stats: any
}

const ExpensePanel = ({ expenses, isLoading, onEdit, onNewClick, onPageChange, onUnlink, page, pageSize, serverPaging, stats }: Props) => {
  
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
            <Pagination page={page}
                        pages={Math.ceil(count / pageSize)}
                        onPageChange={onPageChange} />
          </Col>
        </Row>
      </Panel.Body>
      {stats &&
        <Panel.Footer>
          Sum {stats.sum}kn Types {stats.typeCount} Vendors {stats.vendorCount}
        </Panel.Footer>}
    </Panel>
  );
};

export default ExpensePanel;
