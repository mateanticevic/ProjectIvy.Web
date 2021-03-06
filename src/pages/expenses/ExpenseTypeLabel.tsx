import React from 'react';
import { Badge } from 'react-bootstrap';
import ExpenseTypeIcon from '../../components/ExpenseTypeIcon';

import { ExpenseType } from 'types/expenses';

interface Props {
    expenseType: ExpenseType;
}

const ExpenseTypeLabel = ({ expenseType }: Props) => {

    return (
        <Badge variant="primary">
            {expenseType.icon &&
                <ExpenseTypeIcon typeId={expenseType.id} />
            }
            &nbsp;{expenseType.name}
        </Badge>
    );
};

export default ExpenseTypeLabel;
