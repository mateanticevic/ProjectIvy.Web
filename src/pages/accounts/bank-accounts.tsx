import React from 'react';
import { Account } from 'types/account';
import AccountItem from './account-item';

interface Props {
    accounts: Account[],
}

const BankAccounts = ({ accounts }: Props) => {

    return (
        <React.Fragment>
            <h2>{accounts[0].bank?.name ?? 'Wallets'}</h2>
            {accounts.map(account =>
                <AccountItem account={account} />
            )}
        </React.Fragment>
    );
};

export default BankAccounts;