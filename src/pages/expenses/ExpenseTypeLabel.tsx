import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Label } from 'react-bootstrap/lib';

import { ExpenseType } from 'types/expenses';

type Props = {
    expenseType: ExpenseType
}

const ExpenseTypeLabel = ({ expenseType }: Props) => {

    return (
        <Label bsStyle="primary">
            {expenseType.icon && <FontAwesome name={expenseType.icon} />} {expenseType.name}
        </Label>
    );
}

export default ExpenseTypeLabel;