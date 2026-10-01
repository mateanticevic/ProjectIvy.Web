import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useDropzone } from 'react-dropzone';
import { getFilesFromEvent } from 'utils/dropzone-helper';
import { Button, ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap';
import { RiPlayListAddLine } from 'react-icons/ri';

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

const AccountsPage: React.FC<{ toast: (title: string, message: string) => void }> = ({ toast }) => {
    const selectedAccountId = useRef<string | null | undefined>(undefined);
    const [isImporting, setIsImporting] = useState(false);
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
        selectedAccountId.current = account.id;
        const response = await api.account.getTransactions(account.id!);
        setSelectedAccount(account);
        setTransactions({
            count: response.count ?? 0,
            items: response.items ?? []
        });
        setTransactionsPage(1);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        getFilesFromEvent,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
        noClick: true,
        noKeyboard: true,
        disabled: isImporting || !selectedAccount?.id || selectedAccount.transactionSource == null,
        onDrop: async (files, rejections) => {
            if (rejections.length > 0) {
                toast('Failed', 'Please select a single CSV file.');
                return;
            }
            if (!files.length || !selectedAccount?.id || selectedAccount.transactionSource == null) return;

            const accountId = selectedAccount.id;
            setIsImporting(true);
            try {
                await api.account.postImportTransactions(accountId, files[0], {
                    transactionSource: selectedAccount.transactionSource
                });
                toast('Success', 'Transactions imported successfully.');
            } catch {
                toast('Failed', 'Failed to import transactions.');
                setIsImporting(false);
                return;
            }

            try {
                const response = await api.account.getTransactions(accountId);
                if (selectedAccountId.current === accountId) {
                    setTransactions({ count: response.count ?? 0, items: response.items ?? [] });
                    setTransactionsPage(1);
                }
            } catch {
                toast('Failed', 'Transactions imported, but the transaction list could not be refreshed.');
            } finally {
                setIsImporting(false);
            }
        },
        onError: () => toast('Failed', 'Failed to read the CSV file.')
    });

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
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <RiPlayListAddLine /> Add Account
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
                    <SmartScroll
                        dataLength={accounts.items.length}
                        hasMore={accounts.items.length < accounts.count}
                        onLoadMore={getNextAccountsPage}
                    >
                        {bankIds.map(bankId =>
                            <BankAccounts
                                key={bankId}
                                accounts={accountsByBank[bankId]}
                                selectedAccountId={selectedAccount?.id}
                                onAccountSelected={onAccountSelected}
                            />
                        )}
                    </SmartScroll>
                </Col>
                <Col lg={5}>
                    {selectedAccount && (
                        <div className="d-flex gap-2 mb-3">
                            <Button
                                variant="primary"
                                className="flex-grow-1"
                                onClick={() => setIsTransactionModalOpen(true)}
                            >
                                New Transaction
                            </Button>
                            {selectedAccount.transactionSource != null && (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Button variant="primary" onClick={open} disabled={isImporting}>
                                        {isImporting ? 'Importing...' : 'Import Transactions'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    <SmartScroll
                        dataLength={transactions.items.length}
                        hasMore={transactions.items.length < transactions.count}
                        onLoadMore={getNextPage}
                    >
                        {transactions.items.map((transaction, index) =>
                            <Card key={index}>
                                <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                    <div className="flex-grow-1" style={{ minWidth: 0, flexBasis: '50%' }}>
                                        <time dateTime={moment(transaction.created).format('YYYY-MM-DD')} className="d-block small text-body-secondary mb-1">
                                            {moment(transaction.created).format('D MMM YYYY')}
                                        </time>
                                        <div className="fw-medium text-break">
                                            {transaction.description || 'Transaction'}
                                        </div>
                                    </div>
                                    <div
                                        className={`fs-5 fw-semibold text-end ms-auto ${transaction.amount > 0 ? 'text-success-emphasis' : transaction.amount < 0 ? 'text-danger-emphasis' : 'text-body-secondary'}`}
                                        style={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                        {transaction.amount > 0 && '+'}{transaction.amount?.toFixed(2)}
                                        {selectedAccount?.currency?.symbol && (
                                            <span className="small fw-normal ms-1">{selectedAccount.currency.symbol}</span>
                                        )}
                                    </div>
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
