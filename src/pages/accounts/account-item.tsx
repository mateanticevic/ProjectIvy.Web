import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { MdAccountBalance } from 'react-icons/md';
import { SiRevolut } from 'react-icons/si';

import { Account } from 'types/account';

interface Props {
    account: Account;
}

const iconSize = 20;

const AccountIcon = ({ account }) => {
    if (account.bank?.id === 'revolut') {
        return <SiRevolut size={iconSize} />;
    }

    return <MdAccountBalance size={iconSize} />;
};

const AccountItem = ({ account }: Props) => {
    const amountFormatted = account.balance.toFixed(2).toString();
    const amountWholePart = amountFormatted.substring(0, amountFormatted.indexOf('.'));
    const amountDecimalPart = amountFormatted.substring(amountFormatted.indexOf('.'));

    return (
        <Card>
            <Card.Body className="expense-item">
                <Badge
                    bg="primary"
                >
                    <AccountIcon account={account} />
                </Badge>
                <div className="expense-item-content">
                    <div className="expense-item-title">
                        {account.name}
                    </div>
                    <div className="expense-item-date">
                    </div>
                </div>
                <div className="expense-item-payment">
                    <div className="expense-item-payment-type">
                    </div>
                    <span className="expense-item-amount">{amountWholePart}</span>
                    <span className="expense-item-amount-decimal">{amountDecimalPart}  {account.currency.symbol}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AccountItem;