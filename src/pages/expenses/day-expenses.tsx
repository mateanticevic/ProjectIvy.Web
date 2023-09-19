import moment from 'moment';
import React from 'react';

import ExpenseItem from './expense-item';
import { components } from 'types/ivy-types';

type Expense = components['schemas']['Expense'];

interface Props {
    day: string;
    expenses: Expense[];
    onExpenseClick(expense: Expense): void;
}

const formatDate = (date) => moment().diff(moment(date), 'days') > 6 ? moment(date).format('Do MMMM YYYY') : moment(date).format('dddd');

const DayExpenses = ({ day, expenses, onExpenseClick }: Props) => {
    return (
        <React.Fragment>
            <div>
                <h2>{formatDate(day)}</h2>
            </div>
            {expenses.map(expense =>
                <ExpenseItem
                    key={`expense-item-${expense.id}`}
                    expense={expense}
                    onClick={onExpenseClick}
                />
            )}
        </React.Fragment>
    );
};

export default DayExpenses;