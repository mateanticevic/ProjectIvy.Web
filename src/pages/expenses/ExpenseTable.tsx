import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ExpenseRow from './ExpenseRow';

const ExpenseTable = (props) => {
  
  const rows = props.expenses.map(function(expense){
    return <ExpenseRow key={expense.id} expense={expense} onEdit={props.onEdit} onUnlink={props.onUnlink} />;
  });

  return (
    <Table responsive>
        <tbody>{rows}</tbody>
    </Table>
  );
};

export default ExpenseTable;
