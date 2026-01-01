import React from 'react';
import _ from 'lodash';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import { Page } from 'pages/page';
import BankAccounts from './bank-accounts';
import AccountModal from './account-modal';
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
};

interface State {
    accounts: Account[];
    selectedAccount?: Account;
    transactions: Transaction[];
    isModalOpen: boolean;
    newAccount: AccountBinding;
    currencies: Currency[];
}

class AccountsPage extends Page<unknown, State> {
    state: State = {
        accounts: [],
        transactions: [],
        isModalOpen: false,
        newAccount: {
            name: '',
        },
        currencies: [],
    };

    async componentDidMount() {
        this.setState({
            accounts: await api.account.get({ isActive: true }),
            currencies: await api.currency.get()
        });
    }

    render() {
        const { accounts, transactions, isModalOpen, newAccount, currencies } = this.state;

        const accountsByBank = _.groupBy(accounts, a => a.bank?.id);
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
                        {bankIds.map(bankId =>
                            <BankAccounts
                                key={bankId}
                                accounts={accountsByBank[bankId]}
                                onAccountSelected={this.onAccountSelected}
                            />
                        )}
                    </Col>
                    <Col lg={8}>
                        {transactions.map(transaction =>
                            <Card>
                                <Card.Body>
                                    {moment(transaction.created).format('D MMM YYYY')}{transaction.description}{transaction.amount}
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
                <AccountModal
                    account={newAccount}
                    currencies={currencies}
                    isOpen={isModalOpen}
                    onChange={this.onAccountChange}
                    onClose={this.onModalClose}
                    onSave={this.onAccountSave}
                />
            </Container >
        );
    }

    onAccountSelected = async (account: Account) => {
        this.setState({
            selectedAccount: account,
            transactions: (await api.account.getTransactions(account.id!)).items
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
            newAccount: { name: '' }
        });
    }

    onAccountSave = async () => {
        try {
            await api.account.post(this.state.newAccount);
            const accounts = await api.account.get({ isActive: true });
            this.setState({
                accounts,
                isModalOpen: false,
                newAccount: { name: '' }
            });
        } catch (error) {
            console.error('Failed to create account:', error);
        }
    }
}

export default AccountsPage;
