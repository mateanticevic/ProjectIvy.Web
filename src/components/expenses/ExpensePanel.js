import React from 'react';
import { Row, Col, Pagination } from 'react-bootstrap/lib';

import Panel from '../common/Panel';
import ExpenseTable from './ExpenseTable';

const ExpensePanel = (props) => {

    const expensesHeader = `Expenses (${props.expenses.count})`;

    const serverPaging = props.expenses.items.length <= props.pageSize;

    const expenses = serverPaging ? props.expenses.items : props.expenses.items.slice((props.page - 1) * props.pageSize, props.page * props.pageSize);

    const totalItems = serverPaging ? props.expenses.count : props.expenses.items.length;

    const expenseTable = expenses && expenses.length > 0 ? <ExpenseTable expenses={expenses} onEdit={props.onEdit} onUnlink={props.onUnlink} /> : <h2>No data</h2>;

    function onPageChange(page){
      props.onPageChange(page);
    }

  return (
                <Panel header={expensesHeader} onNewClick={props.onNewClick}>
                    <Row>
                      <Col lg={12}>
                        {expenseTable}
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(totalItems / props.pageSize)}
                                                                                maxButtons={5}
                                                                                activePage={props.page}
                                                                                onSelect={page => onPageChange({page: page})} />
                      </Col>
                    </Row>
                </Panel>
  );
};

export default ExpensePanel;

ExpensePanel.propTypes = {
};