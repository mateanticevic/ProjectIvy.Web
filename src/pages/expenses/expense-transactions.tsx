import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Alert, Button, FormGroup, FormLabel } from 'react-bootstrap';
import Select, { StylesConfig } from 'react-select';

import api from 'api/main';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type Expense = components['schemas']['Expense'];
type Transaction = components['schemas']['TransactionWithAccount'];
type Option = { value: string; label: string; transaction: Transaction };

interface Props {
    expense: Expense;
    onChange: (transactions: Transaction[]) => void;
}

const toOption = (transaction: Transaction, id: string): Option => {
    const created = transaction.created && moment(transaction.created);
    const amount = [transaction.amount, transaction.account?.currency?.code].join(' ').trim();
    const label = [created && created.isValid() && created.format('YYYY-MM-DD'), amount,
        transaction.description, transaction.account?.name].filter(Boolean).join(' · ');

    return { value: id, label: label || id, transaction };
};

const ExpenseTransactions = ({ expense, onChange }: Props) => {
    const styles = useReactSelectStyles();
    const [search, setSearch] = useState<{ date: string; items: Transaction[]; failed?: boolean }>();
    const [retry, setRetry] = useState(0);
    const date = expense.date && moment(expense.date).isValid() ? moment(expense.date).format('YYYY-MM-DD') : '';
    const result = search?.date === date ? search : undefined;

    useEffect(() => {
        setSearch(undefined);
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
        return [{ option: toOption(transaction, transaction.id), dayDistance, amountDistance, currencyMatches, exact }];
    }).sort((a, b) => Number(b.exact) - Number(a.exact)
        || Number(b.currencyMatches) - Number(a.currencyMatches)
        || a.amountDistance - b.amountDistance || a.dayDistance - b.dayDistance);
    const selected = (expense.transactions ?? []).flatMap(transaction => {
        if (!transaction.id) return [];
        return [ranked.find(item => item.option.value === transaction.id)?.option ?? toOption(transaction, transaction.id)];
    });
    const selectedIds = new Set(selected.map(option => option.value));
    const available = ranked.filter(item => !selectedIds.has(item.option.value));
    const matches = available.filter(item => item.exact).map(item => item.option);
    const others = available.filter(item => !item.exact).map(item => item.option);

    return (
        <FormGroup controlId="expense-transactions">
            {available.length > 0 ? (
                <>
                    <FormLabel>Transaction</FormLabel>
                    <Select<Option, true>
                        inputId="expense-transactions"
                        isMulti
                        options={[
                            ...(matches.length ? [{ label: 'Exact matches', options: matches }] : []),
                            ...(others.length ? [{ label: 'Others', options: others }] : []),
                        ]}
                        value={selected}
                        onChange={choices => onChange(choices.map(choice => choice.transaction))}
                        isClearable
                        styles={styles as StylesConfig<Option, true>}
                        placeholder="Select a transaction"
                        noOptionsMessage={() => 'No transactions found'}
                    />
                </>
            ) : (
                <>
                    {selected.length > 0 && (
                        <ul className="list-unstyled mb-2">
                            {selected.map(option => (
                                <li key={option.value}>
                                    {option.label}
                                    {result && !result.failed && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            aria-label={`Remove ${option.label}`}
                                            onClick={() => onChange(selected.filter(item => item.value !== option.value).map(item => item.transaction))}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {!date && <div className="text-muted">Choose an expense date first</div>}
                    {date && !result && <div className="text-muted" role="status">Loading transactions…</div>}
                    {result && !result.failed && <div className="text-muted">No transactions to link</div>}
                </>
            )}
            {result?.failed && <Alert variant="danger">
                Could not load transactions. <Button size="sm" onClick={() => setRetry(value => value + 1)}>Retry transactions</Button>
            </Alert>}
        </FormGroup>
    );
};

export default ExpenseTransactions;
