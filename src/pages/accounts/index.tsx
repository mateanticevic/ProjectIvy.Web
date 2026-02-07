import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import { SmartScroll } from 'components';
import BankAccounts from './bank-accounts';
import AccountModal from './account-modal';
import TransactionModal from './transaction-modal';
import { components } from 'types/ivy-types';
import moment from 'moment';

enum AccountFilter {
    Active = 'active',
    Inactive = 'inactive',
    All = 'all'
}

type Account = components['schemas']['Account'];
type Transaction = components['schemas']['Transaction'];
type Currency = components['schemas']['Currency'];

type AccountBinding = {
    name: string;
    iban?: string;
    bankId?: string;
    currencyId?: string;
    active?: boolean;
};

type TransactionBinding = {
    amount: string;
    date: string;
};

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<{ count: number; items: Account[] }>({
        count: 0,
        items: [],
    });
    const [accountsPage, setAccountsPage] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
    const [transactions, setTransactions] = useState<{ count: number; items: Transaction[] }>({
        count: 0,
        items: [],
    });
    const [transactionsPage, setTransactionsPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState<AccountBinding>({
        name: '',
        active: true,
    });
    const [newTransaction, setNewTransaction] = useState<TransactionBinding>({
        amount: '',
        date: moment().format('YYYY-MM-DD'),
    });
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [editingAccountId, setEditingAccountId] = useState<string | undefined>();
    const [accountFilter, setAccountFilter] = useState<AccountFilter>(AccountFilter.Active);

    const loadAccounts = async () => {
        const params = accountFilter === AccountFilter.All ? {} : { IsActive: accountFilter === AccountFilter.Active };
        const accountsResponse = await api.account.get(params);
        setAccounts({
            count: accountsResponse?.count ?? 0,
            items: accountsResponse?.items ?? []
        });
        setAccountsPage(0);
    };

    useEffect(() => {
        const loadData = async () => {
            await loadAccounts();
            setCurrencies(await api.currency.get());
        };
        loadData();
    }, []);

    useEffect(() => {
        loadAccounts();
    }, [accountFilter]);

    const onAccountSelected = async (account: Account) => {
        const response = await api.account.getTransactions(account.id!);
        setSelectedAccount(account);
        setTransactions({
            count: response.count ?? 0,
            items: response.items ?? []
        });
        setTransactionsPage(1);
    };

    const getNextPage = async () => {
        if (!selectedAccount?.id) return;

        const nextPage = transactionsPage + 1;
        const response = await api.account.getTransactions(selectedAccount.id!, { Page: nextPage });
        setTransactionsPage(nextPage);
        setTransactions({
            count: response.count ?? 0,
            items: [...transactions.items, ...(response.items ?? [])]
        });
    };

    const getNextAccountsPage = async () => {
        const nextPage = accountsPage + 1;
        const params = accountFilter === AccountFilter.All ? { Page: nextPage } : { IsActive: accountFilter === AccountFilter.Active, Page: nextPage };
        const response = await api.account.get(params);
        setAccountsPage(nextPage);
        setAccounts({
            count: response.count ?? 0,
            items: [...accounts.items, ...(response.items ?? [])]
        });
    };

    const onFilterChange = async (filter: AccountFilter) => {
        setAccountFilter(filter);
    };

    const onAccountChange = (changed: Partial<AccountBinding>) => {
        setNewAccount({ ...newAccount, ...changed });
    };

    const onModalClose = () => {
        setIsModalOpen(false);
        setNewAccount({ name: '', active: true });
        setEditingAccountId(undefined);
    };

    const onAccountEdit = (account: Account) => {
        setIsModalOpen(true);
        setEditingAccountId(account.id ?? undefined);
        setNewAccount({
            name: account.name!,
            iban: account.iban ?? undefined,
            bankId: account.bank?.id ?? undefined,
            currencyId: account.currency?.id ?? undefined,
            active: true
        });
    };

    const onAccountSave = async () => {
        try {
            if (editingAccountId) {
                await api.account.put(editingAccountId, newAccount);
            } else {
                await api.account.post(newAccount);
            }

            await loadAccounts();
            setIsModalOpen(false);
            setNewAccount({ name: '', active: true });
            setEditingAccountId(undefined);
        } catch (error) {
            console.error('Failed to save account:', error);
        }
    };

    const onTransactionChange = (changed: Partial<TransactionBinding>) => {
        setNewTransaction({ ...newTransaction, ...changed });
    };

    const onTransactionModalClose = () => {
        setIsTransactionModalOpen(false);
        setNewTransaction({
            amount: '',
            date: moment().format('YYYY-MM-DD')
        });
    };

    const onTransactionSave = async () => {
        try {
            if (!selectedAccount?.id) return;

            await api.account.postTransaction(selectedAccount.id, {
                amount: parseFloat(newTransaction.amount),
                created: newTransaction.date
            } as Transaction);

            // Refresh transactions after saving
            const response = await api.account.getTransactions(selectedAccount.id);
            setTransactions({
                count: response.count ?? 0,
                items: response.items ?? []
            });
            setTransactionsPage(1);
            setIsTransactionModalOpen(false);
            setNewTransaction({
                amount: '',
                date: moment().format('YYYY-MM-DD')
            });
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    };

    const accountsByBank = _.groupBy(accounts.items, a => a.bank?.id);
    const bankIds = Object.keys(accountsByBank);

    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <Card>
                        <Card.Body>
                            <div className="form-grid">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="mb-3"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add Account
                                </Button>
                                <ButtonGroup className="d-flex">
                                    <Button
                                        size="sm"
                                        active={accountFilter === AccountFilter.Active}
                                        onClick={() => onFilterChange(AccountFilter.Active)}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        size="sm"
                                        active={accountFilter === AccountFilter.Inactive}
                                        onClick={() => onFilterChange(AccountFilter.Inactive)}
                                    >
                                        Inactive
                                    </Button>
                                    <Button
                                        size="sm"
                                        active={accountFilter === AccountFilter.All}
                                        onClick={() => onFilterChange(AccountFilter.All)}
                                    >
                                        All
                                    </Button>
                                </ButtonGroup>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    {selectedAccount && (
                        <Button
                            variant="success"
                            size="sm"
                            className="mb-3 ms-2"
                            onClick={() => setIsTransactionModalOpen(true)}
                        >
                            New Transaction
                        </Button>
                    )}
                    <SmartScroll
                        dataLength={accounts.items.length}
                        hasMore={accounts.items.length < accounts.count}
                        onLoadMore={getNextAccountsPage}
                    >
                        {bankIds.map(bankId =>
                            <BankAccounts
                                key={bankId}
                                accounts={accountsByBank[bankId]}
                                onAccountSelected={onAccountSelected}
                                onAccountEdit={onAccountEdit}
                            />
                        )}
                    </SmartScroll>
                </Col>
                <Col lg={5}>
                    <SmartScroll
                        dataLength={transactions.items.length}
                        hasMore={transactions.items.length < transactions.count}
                        onLoadMore={getNextPage}
                    >
                        {transactions.items.map((transaction, index) =>
                            <Card key={index}>
                                <Card.Body>
                                    {moment(transaction.created).format('D MMM YYYY')} {transaction.description} {transaction.amount}
                                </Card.Body>
                            </Card>
                        )}
                    </SmartScroll>
                </Col>
            </Row>
            <AccountModal
                account={newAccount}
                currencies={currencies}
                isOpen={isModalOpen}
                onChange={onAccountChange}
                onClose={onModalClose}
                onSave={onAccountSave}
                isEditing={!!editingAccountId}
            />
            <TransactionModal
                transaction={newTransaction}
                isOpen={isTransactionModalOpen}
                onChange={onTransactionChange}
                onClose={onTransactionModalClose}
                onSave={onTransactionSave}
            />
        </Container>
    );
};

export default AccountsPage;
