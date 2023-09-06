import React from 'react';
import Table from 'react-bootstrap/Table';

import ExpenseRow from './expense-row';
import { ExpenseTableLoader } from './expense-table-loader';
import { components } from 'types/ivy-types';

type Expense = components['schemas']['Expense'];

interface Props {
    expenses: Expense[],
    isLoading: boolean,
    onEdit(): void,
    onLink(): void,
    onUnlink(): void,
}

const ExpenseTable = ({ expenses, isLoading, onEdit, onLink, onUnlink }: Props) =>
    <Table responsive>
        <tbody>
            {isLoading ?
                <ExpenseTableLoader />
                :
                (expenses.map(expense =>
                    <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onEdit={onEdit}
                        onLink={onLink}
                        onUnlink={onUnlink}
                    />
                ))
            }
        </tbody>
    </Table>;

export default ExpenseTable;
