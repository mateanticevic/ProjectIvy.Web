import React from 'react';
import _ from 'lodash';
import { Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import { Page } from 'pages/page';
import { Account } from 'types/account';
import BankAccounts from './bank-accounts';

interface State {
    accounts: Account[];
}

class AccountsPage extends Page<{}, State> {
    state: State = {
        accounts: [],
    };

    async componentDidMount() {
        this.setState({
            accounts: await api.account.get({ isActive: true })
        });
    }

    render() {
        const { accounts } = this.state;

        const accountsByBank = _.groupBy(accounts, a => a.bank?.id);
        const bankIds = Object.keys(accountsByBank);

        return (
            <Container>
                <Row>
                    <Col lg={6}>
                        {bankIds.map(bankId =>
                            <BankAccounts
                                key={bankId}
                                accounts={accountsByBank[bankId]}
                            />
                        )}
                    </Col>
                </Row>
            </Container >
        );
    }
}

export default AccountsPage;