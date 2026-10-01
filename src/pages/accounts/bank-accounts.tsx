import React from 'react';

import AccountItem from './account-item';
import { components } from 'types/ivy-types';

type Account = components['schemas']['Account'];

interface Props {
    accounts: Account[],
    selectedAccountId?: string;
    onAccountSelected: (account: Account) => void;
    onAccountEdit: (account: Account) => void;
}

const BankAccounts = ({ accounts, selectedAccountId, onAccountSelected, onAccountEdit }: Props) => {

    return (
        <React.Fragment>
            <h2>{accounts[0].bank?.name ?? 'Wallets'}</h2>
            {accounts.map(account =>
                <AccountItem 
                    key={account.id}
                    account={account} 
                    isSelected={!!selectedAccountId && account.id === selectedAccountId}
                    onAccountSelected={onAccountSelected}
                    onAccountEdit={onAccountEdit}
                />
            )}
        </React.Fragment>
    );
};

export default BankAccounts;
