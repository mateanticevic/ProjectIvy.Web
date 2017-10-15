import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ExpenseRow from './ExpenseRow';

const ExpenseTable = (props) => {
  
  const rows = props.expenses.map(function(expense){
    return <ExpenseRow key={expense.id} expense={expense} onEdit={props.onEdit} />;
  });

  return (
    <Table responsive>
        <thead>
            <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Vendor</th>
            <th>Description</th>
            <th>Amount</th>
            <th/>
            <th>Actions</th>
            </tr>
            {rows}
        </thead>
    </Table>
  );
};

export default ExpenseTable;

ExpenseTable.propTypes = {
  children: React.PropTypes.array
};