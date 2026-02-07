import React from 'react';
import _ from 'lodash';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import { SmartScroll } from 'components';
import { Page } from 'pages/page';
import BankAccounts from './bank-accounts';
import AccountModal from './account-modal';
import TransactionModal from './transaction-modal';
import { components } from 'types/ivy-types';
import moment from 'moment';

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

interface State {
    accounts: {
        count: number;
        items: Account[];
    };
    accountsPage: number;
    selectedAccount?: Account;
    transactions: {
        count: number;
        items: Transaction[];
    };
    transactionsPage: number;
    isModalOpen: boolean;
    isTransactionModalOpen: boolean;
    newAccount: AccountBinding;
    newTransaction: TransactionBinding;
    currencies: Currency[];
    editingAccountId?: string;
}

class AccountsPage extends Page<unknown, State> {
    state: State = {
        accounts: {
            count: 0,
            items: [],
        },
        accountsPage: 1,
        transactions: {
            count: 0,
            items: [],
        },
        transactionsPage: 1,
        isModalOpen: false,
        isTransactionModalOpen: false,
        newAccount: {
            name: '',
            active: true,
        },
        newTransaction: {
            amount: '',
            date: moment().format('YYYY-MM-DD'),
        },
        currencies: [],
    };

    async componentDidMount() {
        const accountsResponse = await api.account.get({ IsActive: true });
        this.setState({
            accounts: {
                count: accountsResponse?.count ?? 0,
                items: accountsResponse?.items ?? []
            },
            currencies: await api.currency.get()
        });
    }

    render() {
        const { accounts, transactions, isModalOpen, isTransactionModalOpen, newAccount, newTransaction, currencies, selectedAccount } = this.state;

        const accountsByBank = _.groupBy(accounts.items, a => a.bank?.id);
        const bankIds = Object.keys(accountsByBank);

        return (
            <Container>
                <Row>
                    <Col lg={4}>
                        <Button
                            variant="primary"
                            size="sm"
                            className="mb-3"
                            onClick={() => this.setState({ isModalOpen: true })}
                        >
                            Add Account
                        </Button>
                        {selectedAccount && (
                            <Button
                                variant="success"
                                size="sm"
                                className="mb-3 ms-2"
                                onClick={() => this.setState({ isTransactionModalOpen: true })}
                            >
                                New Transaction
                            </Button>
                        )}
                        <SmartScroll
                            dataLength={accounts.items.length}
                            hasMore={accounts.items.length < accounts.count}
                            onLoadMore={this.getNextAccountsPage}
                        >
                            {bankIds.map(bankId =>
                                <BankAccounts
                                    key={bankId}
                                    accounts={accountsByBank[bankId]}
                                    onAccountSelected={this.onAccountSelected}
                                    onAccountEdit={this.onAccountEdit}
                                />
                            )}
                        </SmartScroll>
                    </Col>
                    <Col lg={8}>
                        <SmartScroll
                            dataLength={transactions.items.length}
                            hasMore={transactions.items.length < transactions.count}
                            onLoadMore={this.getNextPage}
                        >
                            {transactions.items.map(transaction =>
                                <Card key={transaction.id}>
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
                    onChange={this.onAccountChange}
                    onClose={this.onModalClose}
                    onSave={this.onAccountSave}
                    isEditing={!!this.state.editingAccountId}
                />
                <TransactionModal
                    transaction={newTransaction}
                    isOpen={isTransactionModalOpen}
                    onChange={this.onTransactionChange}
                    onClose={this.onTransactionModalClose}
                    onSave={this.onTransactionSave}
                />
            </Container >
        );
    }

    onAccountSelected = async (account: Account) => {
        const response = await api.account.getTransactions(account.id!);
        this.setState({
            selectedAccount: account,
            transactions: {
                count: response.count,
                items: response.items
            },
            transactionsPage: 1
        });
    }

    getNextPage = async () => {
        const { selectedAccount, transactionsPage, transactions } = this.state;
        if (!selectedAccount?.id) return;

        const nextPage = transactionsPage + 1;
        const response = await api.account.getTransactions(selectedAccount.id!, { page: nextPage });
        this.setState({
            transactionsPage: nextPage,
            transactions: {
                count: response.count,
                items: [...transactions.items, ...response.items]
            }
        });
    }

    getNextAccountsPage = async () => {
        const { accountsPage, accounts } = this.state;
        const nextPage = accountsPage + 1;
        const response = await api.account.get({ IsActive: true, page: nextPage });
        this.setState({
            accountsPage: nextPage,
            accounts: {
                count: response.count,
                items: [...accounts.items, ...response.items]
            }
        });
    }

    onAccountChange = (changed: Partial<AccountBinding>) => {
        this.setState({
            newAccount: { ...this.state.newAccount, ...changed }
        });
    }

    onModalClose = () => {
        this.setState({
            isModalOpen: false,
            newAccount: { name: '', active: true },
            editingAccountId: undefined
        });
    }

    onAccountEdit = (account: Account) => {
        this.setState({
            isModalOpen: true,
            editingAccountId: account.id ?? undefined,
            newAccount: {
                name: account.name!,
                iban: account.iban ?? undefined,
                bankId: account.bank?.id ?? undefined,
                currencyId: account.currency?.id ?? undefined,
                active: true // Default to true since Account schema doesn't have active property
            }
        });
    }

    onAccountSave = async () => {
        try {
            const { editingAccountId, newAccount } = this.state;
            
            if (editingAccountId) {
                await api.account.put(editingAccountId, newAccount);
            } else {
                await api.account.post(newAccount);
            }
            
            const accountsResponse = await api.account.get({ isActive: true });
            this.setState({
                accounts: {
                    count: accountsResponse.count,
                    items: accountsResponse.items
                },
                accountsPage: 1,
                isModalOpen: false,
                newAccount: { name: '', active: true },
                editingAccountId: undefined
            });
        } catch (error) {
            console.error('Failed to save account:', error);
        }
    }

    onTransactionChange = (changed: Partial<TransactionBinding>) => {
        this.setState({
            newTransaction: { ...this.state.newTransaction, ...changed }
        });
    }

    onTransactionModalClose = () => {
        this.setState({
            isTransactionModalOpen: false,
            newTransaction: {
                amount: '',
                date: moment().format('YYYY-MM-DD')
            }
        });
    }

    onTransactionSave = async () => {
        try {
            const { selectedAccount, newTransaction } = this.state;
            if (!selectedAccount?.id) return;

            await api.account.postTransaction(selectedAccount.id, {
                amount: parseFloat(newTransaction.amount),
                created: newTransaction.date
            } as Transaction);

            // Refresh transactions after saving
            const response = await api.account.getTransactions(selectedAccount.id);
            this.setState({
                transactions: {
                    count: response.count,
                    items: response.items
                },
                transactionsPage: 1,
                isTransactionModalOpen: false,
                newTransaction: {
                    amount: '',
                    date: moment().format('YYYY-MM-DD')
                }
            });
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    }
}

export default AccountsPage;
