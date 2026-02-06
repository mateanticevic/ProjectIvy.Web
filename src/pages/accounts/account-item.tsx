import React from 'react';
import { Badge, Card, Button } from 'react-bootstrap';
import { MdAccountBalance, MdEdit } from 'react-icons/md';
import { SiRevolut } from 'react-icons/si';

import { components } from 'types/ivy-types';

type Account = components['schemas']['Account'];

interface Props {
    account: Account;
    onAccountSelected: (account: Account) => void;
    onAccountEdit: (account: Account) => void;
}

const iconSize = 20;

const AccountIcon = ({ account }) => {
    if (account.bank?.id === 'revolut') {
        return <SiRevolut size={iconSize} />;
    }

    return <MdAccountBalance size={iconSize} />;
};

const AccountItem = ({ account, onAccountSelected, onAccountEdit }: Props) => {
    const amountFormatted = account.balance!.toFixed(2).toString();
    const amountWholePart = amountFormatted.substring(0, amountFormatted.indexOf('.'));
    const amountDecimalPart = amountFormatted.substring(amountFormatted.indexOf('.'));

    const defaultAmountFormatted = account.balanceInDefaultCurrency!.toFixed(2).toString();
    const defaultAmountWholePart = defaultAmountFormatted.substring(0, defaultAmountFormatted.indexOf('.'));
    const defaultAmountDecimalPart = defaultAmountFormatted.substring(defaultAmountFormatted.indexOf('.'));

    return (
        <Card>
            <Card.Body className="expense-item" onClick={() => onAccountSelected(account)}>
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
                    <div className="expense-item-payment-type">
                        <Button 
                            variant="link" 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onAccountEdit(account);
                            }}
                            style={{ padding: '0 8px' }}
                        >
                            <MdEdit size={18} />
                        </Button>
                    </div>
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