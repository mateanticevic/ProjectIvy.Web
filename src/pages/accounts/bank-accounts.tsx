import React from 'react';

import AccountItem from './account-item';
import { components } from 'types/ivy-types';

type Account = components['schemas']['Account'];

interface Props {
    accounts: Account[],
    onAccountSelected: (account: Account) => void;
}

const BankAccounts = ({ accounts, onAccountSelected }: Props) => {

    return (
        <React.Fragment>
            <h2>{accounts[0].bank?.name ?? 'Wallets'}</h2>
            {accounts.map(account =>
                <AccountItem account={account} onAccountSelected={onAccountSelected} />
            )}
        </React.Fragment>
    );
};

export default BankAccounts;