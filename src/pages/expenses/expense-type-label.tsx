import React from 'react';
import { Badge } from 'react-bootstrap';
import ExpenseTypeIcon from 'components/expense-type-icon';

import { ExpenseType } from 'types/expenses';

interface Props {
    expenseType: ExpenseType;
}

const ExpenseTypeLabel = ({ expenseType }: Props) => {

    return (
        <Badge variant="primary">
            <ExpenseTypeIcon typeId={expenseType.id} />
            &nbsp;{expenseType.name}
        </Badge>
    );
};

export default ExpenseTypeLabel;
