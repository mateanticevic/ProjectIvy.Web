import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Alert, Button, FormGroup, FormLabel } from 'react-bootstrap';
import Select, { StylesConfig } from 'react-select';

import api from 'api/main';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type Expense = components['schemas']['Expense'];
type Transaction = components['schemas']['TransactionWithAccount'];
type Option = { value: string; label: string };

const ExpenseTransactions = ({ expense }: { expense: Expense }) => {
    const styles = useReactSelectStyles();
    const [search, setSearch] = useState<{ date: string; items: Transaction[]; failed?: boolean }>();
    const [retry, setRetry] = useState(0);
    const [selected, setSelected] = useState<Option | null>(null);
    const date = expense.date && moment(expense.date).isValid() ? moment(expense.date).format('YYYY-MM-DD') : '';
    const result = search?.date === date ? search : undefined;

    useEffect(() => {
        setSearch(undefined);
        setSelected(null);
        if (!date) return;
        let ignore = false;
        api.transactions.get({
            From: moment(date).subtract(3, 'days').format('YYYY-MM-DD'),
            To: moment(date).add(3, 'days').format('YYYY-MM-DD'),
            PageAll: true,
        })
            .then(response => { if (!ignore) setSearch({ date, items: response.items ?? [] }); })
            .catch(() => { if (!ignore) setSearch({ date, items: [], failed: true }); });
        return () => { ignore = true; };
    }, [date, retry, expense.id]);

    const amount = Number(expense.amount);
    const ranked = (result?.items ?? []).flatMap(transaction => {
        if (!transaction.id || !transaction.created || !moment(transaction.created).isValid()) return [];
        const dayDistance = Math.abs(moment(transaction.created).startOf('day').diff(moment(date), 'days'));
        if (dayDistance > 3) return [];
        const amountDistance = Number.isFinite(transaction.amount) && Number.isFinite(amount)
            ? Math.abs(Math.abs(transaction.amount!) - Math.abs(amount)) : Infinity;
        const currencyMatches = !!expense.currency?.id && transaction.account?.currency?.id === expense.currency.id;
        const exact = dayDistance === 0 && amountDistance < 0.000001 && currencyMatches;
        return [{ transaction, dayDistance, amountDistance, currencyMatches, exact }];
    }).sort((a, b) => Number(b.exact) - Number(a.exact)
        || Number(b.currencyMatches) - Number(a.currencyMatches)
        || a.amountDistance - b.amountDistance || a.dayDistance - b.dayDistance);
    const toOption = ({ transaction }: typeof ranked[number]): Option => ({
        value: transaction.id!,
        label: [moment(transaction.created).format('YYYY-MM-DD'),
            `${transaction.amount ?? ''} ${transaction.account?.currency?.code ?? ''}`.trim(),
            transaction.description, transaction.account?.name].filter(Boolean).join(' · '),
    });
    const matches = ranked.filter(item => item.exact).map(toOption);
    const others = ranked.filter(item => !item.exact).map(toOption);

    return (
        <FormGroup controlId="expense-transactions">
            <FormLabel>Transaction</FormLabel>
            <Select<Option, false>
                inputId="expense-transactions"
                options={[
                    ...(matches.length ? [{ label: 'Exact matches', options: matches }] : []),
                    ...(others.length ? [{ label: 'Others', options: others }] : []),
                ]}
                value={selected}
                onChange={setSelected}
                isClearable
                isDisabled={!date || !result || result.failed}
                isLoading={!!date && !result}
                styles={styles as StylesConfig<Option, false>}
                placeholder={date ? 'Select a transaction' : 'Choose an expense date first'}
                noOptionsMessage={() => 'No transactions found'}
            />
            {result?.failed && <Alert variant="danger">
                Could not load transactions. <Button size="sm" onClick={() => setRetry(value => value + 1)}>Retry transactions</Button>
            </Alert>}
        </FormGroup>
    );
};

export default ExpenseTransactions;
