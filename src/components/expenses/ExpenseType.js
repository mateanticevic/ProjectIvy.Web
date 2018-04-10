import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Label } from 'react-bootstrap/lib';

const ExpenseType = (props) => {

    return (
        <Label bsStyle="primary"><FontAwesome name={props.expense.expenseType.icon} /> {props.expense.expenseType.name}</Label>
    );
}

export default ExpenseType;