import React from 'react';
import { Badge } from 'react-bootstrap';
import ExpenseTypeIcon from 'components/expense-type-icon';

import { components } from 'types/ivy-types';

type ExpenseType = components['schemas']['ExpenseType'];

interface Props {
    type: ExpenseType;
}

const ExpenseTypeLabel = ({ type }: Props) => {

    return (
        <Badge variant="primary">
            <ExpenseTypeIcon typeId={type!.id!} />
            &nbsp;{type.name}
        </Badge>
    );
};

export default ExpenseTypeLabel;
