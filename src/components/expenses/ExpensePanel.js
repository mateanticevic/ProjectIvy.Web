import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Pagination from 'react-bootstrap/lib/Pagination';
import ExpenseRow from './ExpenseRow';
import ExpenseFilters from './ExpenseFilters';
import ExpenseModal from './ExpenseModal';
import ExpenseTable from './ExpenseTable';

const ExpensePanel = (props) => {

    const expensesHeader = `Expenses (${props.expenses.count})`;

    const serverPaging = props.expenses.items.length <= props.pageSize;

    const expenses = serverPaging ? props.expenses.items : props.expenses.items.slice((props.page - 1) * props.pageSize, props.page * props.pageSize);

    const totalItems = serverPaging ? props.expenses.count : props.expenses.items.length;

    function clientPageChange(page){
      if (serverPaging){
        props.onPageChange(page);
      }
      else{

      }
    }

  return (
                <Panel header={expensesHeader}>
                    <Row>
                      {props.showButtons &&
                      <Col lg={12}>
                        <Button onClick={props.onNewClick}>New</Button>                  
                      </Col>
                      }
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <ExpenseTable expenses={expenses} onEdit={props.onEdit} />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(totalItems / props.pageSize)}
                                                                                maxButtons={5}
                                                                                activePage={props.page}
                                                                                onSelect={page => clientPageChange({page: page})} />
                      </Col>
                    </Row>
                </Panel>
  );
};

export default ExpensePanel;

ExpensePanel.propTypes = {
};