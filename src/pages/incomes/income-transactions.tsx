import React, { useEffect, useState } from 'react';
import { Alert, Button, FormGroup, FormLabel } from 'react-bootstrap';
import Select, { StylesConfig } from 'react-select';
import moment from 'moment';

import api from 'api/main';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type Transaction = components['schemas']['TransactionWithAccount'];

interface TransactionOption {
    value: string;
    label: string;
}

interface Props {
    date?: string;
    disabled: boolean;
    linkedTransactions?: Transaction[];
    transactionIds?: string[] | null;
    onChange(ids: string[]): void;
}

const toOptions = (transactions: Transaction[]): TransactionOption[] => transactions.flatMap(transaction => {
    if (!transaction.id) return [];

    const amount = [transaction.amount, transaction.account?.currency?.code].join(' ').trim();
    const date = transaction.created && moment(transaction.created).format('YYYY-MM-DD');
    const label = [amount, date].filter(Boolean).join(' - ') || transaction.id;

    return [{ value: transaction.id, label }];
});

const IncomeTransactions = ({ date, disabled, linkedTransactions, transactionIds, onChange }: Props) => {
    const styles = useReactSelectStyles();
    const [selected, setSelected] = useState(() => toOptions(linkedTransactions ?? []));
    const [search, setSearch] = useState<{ date: string; options: TransactionOption[]; failed?: boolean }>();
    const [retry, setRetry] = useState(0);
    const validDate = date && moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '';
    const result = search?.date === validDate ? search : undefined;
    const options = result?.options ?? [];

    useEffect(() => {
        setSearch(undefined);
        if (!validDate) return;
        let ignore = false;
        api.transactions.get({
            From: moment(validDate).subtract(3, 'days').format('YYYY-MM-DD'),
            To: moment(validDate).add(3, 'days').format('YYYY-MM-DD'),
            PageAll: true,
        })
            .then(response => {
                if (!ignore) setSearch({ date: validDate, options: toOptions(response.items ?? []) });
            })
            .catch(() => {
                if (!ignore) setSearch({ date: validDate, options: [], failed: true });
            });
        return () => { ignore = true; };
    }, [validDate, retry]);

    return (
        <FormGroup controlId="income-transactions">
            <FormLabel>Transactions</FormLabel>
            <Select<TransactionOption, true>
                inputId="income-transactions"
                isMulti
                isDisabled={disabled || !validDate}
                isLoading={!!validDate && !result}
                options={options}
                value={(transactionIds ?? []).map(id =>
                    options.find(option => option.value === id)
                    ?? selected.find(option => option.value === id)
                    ?? { value: id, label: id }
                )}
                onChange={choices => {
                    setSelected([...choices]);
                    onChange(choices.map(choice => choice.value));
                }}
                styles={styles as StylesConfig<TransactionOption, true>}
                placeholder={validDate ? 'Select transactions' : 'Choose an income date first'}
            />
            {result?.failed && (
                <Alert variant="danger">
                    Could not load transactions. <Button size="sm" onClick={() => {
                        setSearch(undefined);
                        setRetry(value => value + 1);
                    }}>Retry transactions</Button>
                </Alert>
            )}
        </FormGroup>
    );
};

export default IncomeTransactions;
