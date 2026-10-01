import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { MdAccountBalance } from 'react-icons/md';
import { SiRevolut } from 'react-icons/si';

import { components } from 'types/ivy-types';

type Account = components['schemas']['Account'];

interface Props {
    account: Account;
    isSelected: boolean;
    onAccountSelected: (account: Account) => void;
}

const iconSize = 20;

const AccountIcon = ({ account }) => {
    if (account.bank?.id === 'revolut') {
        return <SiRevolut size={iconSize} />;
    }

    return <MdAccountBalance size={iconSize} />;
};

const AccountItem = ({ account, isSelected, onAccountSelected }: Props) => {
    const amountFormatted = account.balance!.toFixed(2).toString();
    const amountWholePart = amountFormatted.substring(0, amountFormatted.indexOf('.'));
    const amountDecimalPart = amountFormatted.substring(amountFormatted.indexOf('.'));

    const defaultAmountFormatted = account.balanceInDefaultCurrency!.toFixed(2).toString();
    const defaultAmountWholePart = defaultAmountFormatted.substring(0, defaultAmountFormatted.indexOf('.'));
    const defaultAmountDecimalPart = defaultAmountFormatted.substring(defaultAmountFormatted.indexOf('.'));

    return (
        <Card
            className="cursor-pointer"
            onClick={() => onAccountSelected(account)}
            style={isSelected ? { backgroundImage: 'linear-gradient(rgba(var(--bs-primary-rgb), 0.1), rgba(var(--bs-primary-rgb), 0.1))' } : undefined}
        >
            <Card.Body className="expense-item">
                <Badge bg="primary">
                    <AccountIcon account={account} />
                </Badge>
                <div className="expense-item-content">
                    <div className="expense-item-title">
                        {account.name} ({account.currency!.id})
                    </div>
                    <div className="expense-item-date">
                    </div>
                </div>
                <div className="expense-item-payment">
                    <div>
                        <span className="expense-item-amount">{amountWholePart}</span>
                        <span className="expense-item-amount-decimal">{amountDecimalPart}  {account.currency!.symbol}</span>
                    </div>
                    {account.balance !== account.balanceInDefaultCurrency &&
                        <div className="expense-item-date">
                            <span className="expense-item-amount-default">{defaultAmountWholePart}</span>
                            <span className="expense-item-amount-default-decimal">{defaultAmountDecimalPart} €</span>
                        </div>
                    }
                </div>
            </Card.Body>
        </Card>
    );
};

export default AccountItem;
