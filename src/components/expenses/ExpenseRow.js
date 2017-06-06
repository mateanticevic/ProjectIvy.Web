import React from 'react';
import Moment from 'react-moment';

const ExpenseRow = (props) => {
  return (
  <tr key={props.expense.valueId}>
      <td><Moment format="Do MMMM YYYY">{props.expense.date}</Moment></td>
      <td>{props.expense.expenseType.name}</td>
      <td>{props.expense.vendor && props.expense.vendor.name}</td>
      <td>{props.expense.comment}</td>
      <td><span className="pull-right">{props.expense.amount.toFixed(2)}</span></td>
      <td>{props.expense.currency.symbol}</td>
  </tr>
  );
};

export default ExpenseRow;
