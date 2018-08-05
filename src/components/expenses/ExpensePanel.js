import React from 'react';
import { Row, Col, Pagination, Panel, Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import ExpenseTable from './ExpenseTable';

const ExpensePanel = (props) => {

  const expensesHeader = `Expenses (${props.expenses.count})`;

  const expenses = props.serverPaging ? props.expenses.items : props.expenses.items.slice((props.page - 1) * props.pageSize, props.page * props.pageSize);

  //const totalItems = props.serverPaging ? props.expenses.count : props.expenses.items.length;

  const expenseTable = expenses && expenses.length > 0 ? <ExpenseTable expenses={expenses} onEdit={props.onEdit} onUnlink={props.onUnlink} /> : <h2>No data</h2>;

  const paginationItems = _.range(2, 5).map(item => <Pagination.Item onSelect={page => props.onPageChange({ page: page })}>{item}</Pagination.Item>);

  return (
    <Panel>
      <Panel.Heading>
        <Row>
          <Col xs={10}>
            {expensesHeader}
          </Col>
          <Col xs={2}>
            {props.onNewClick &&
              <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={props.onNewClick}><FontAwesome name="plus" /> New</Button>
            }
          </Col>
        </Row>
      </Panel.Heading>
      <Panel.Body>
        <Row>
          <Col lg={12}>
            {expenseTable}
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {/*             <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(totalItems / props.pageSize)}
              maxButtons={5}
              activePage={props.page}
              onSelect={page => props.onPageChange({ page: page })} /> */}
            <Pagination onSelect={page => props.onPageChange({ page: page })}>
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              {paginationItems}
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </Col>
        </Row>
      </Panel.Body>
      {props.stats &&
        <Panel.Footer>
          Sum {props.stats.sum}kn Types {props.stats.types} Vendors {props.stats.vendors}
        </Panel.Footer>}
    </Panel>
  );
};

export default ExpensePanel;

ExpensePanel.propTypes = {
};