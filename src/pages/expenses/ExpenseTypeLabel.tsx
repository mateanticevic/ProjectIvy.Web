import React from 'react';
import { Label } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import { ExpenseType } from 'types/expenses';

interface Props {
    expenseType: ExpenseType;
}

const ExpenseTypeLabel = ({ expenseType }: Props) => {

    return (
        <Label bsStyle="primary">
            {expenseType.icon && <FontAwesome name={expenseType.icon} />} {expenseType.name}
        </Label>
    );
};

export default ExpenseTypeLabel;
