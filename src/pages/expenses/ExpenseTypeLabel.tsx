import React from 'react';
import { Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { ExpenseType } from 'types/expenses';

interface Props {
    expenseType: ExpenseType;
}

const ExpenseTypeLabel = ({ expenseType }: Props) => {

    return (
        <Badge variant="primary">
            {expenseType.icon && <FontAwesome name={expenseType.icon} />} {expenseType.name}
        </Badge>
    );
};

export default ExpenseTypeLabel;
