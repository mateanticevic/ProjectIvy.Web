import React from 'react';
import _ from 'lodash';
import { Card, Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import { Page } from 'pages/page';
import BankAccounts from './bank-accounts';
import { components } from 'types/ivy-types';
import moment from 'moment';

type Account = components['schemas']['Account'];
type Transaction = components['schemas']['Transaction'];

interface State {
    accounts: Account[];
    selectedAccount?: Account;
    transactions: Transaction[];
}

class AccountsPage extends Page<unknown, State> {
    state: State = {
        accounts: [],
        transactions: [],
    };

    async componentDidMount() {
        this.setState({
            accounts: await api.account.get({ isActive: true })
        });
    }

    render() {
        const { accounts, transactions } = this.state;

        const accountsByBank = _.groupBy(accounts, a => a.bank?.id);
        const bankIds = Object.keys(accountsByBank);

        return (
            <Container>
                <Row>
                    <Col lg={4}>
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
            </Container >
        );
    }

    onAccountSelected = async (account: Account) => {
        this.setState({
            selectedAccount: account,
            transactions: (await api.account.getTransactions(account.id!)).items
        });
    }
}

export default AccountsPage;