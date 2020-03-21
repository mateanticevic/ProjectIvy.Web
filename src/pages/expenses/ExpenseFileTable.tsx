import React from 'react';
import Table from 'react-bootstrap/Table';
import ExpenseFileRow from './ExpenseFileRow';

const ExpenseFileTable = (props) => {

  const rows = props.files ? props.files.map(function(expenseFile) {
    return <ExpenseFileRow key={expenseFile.file.id} expenseFile={expenseFile} />;
  }) : null;

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Created</th>
          <th>Size</th>
          <th>Document</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ExpenseFileTable;
