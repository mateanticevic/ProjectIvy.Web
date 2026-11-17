import React from 'react';

import AccountItem from './account-item';
import { components } from 'types/ivy-types';

type Account = components['schemas']['Account'];

interface Props {
    accounts: Account[],
    selectedAccountId?: string;
    onAccountSelected: (account: Account) => void;
    relinkingAccountIds: ReadonlySet<string>;
    onRelinkTransactions: (account: Account) => void;
}

const BankAccounts = ({ accounts, selectedAccountId, onAccountSelected, relinkingAccountIds, onRelinkTransactions }: Props) => {

    return (
        <React.Fragment>
            <h2>{accounts[0].bank?.name ?? 'Wallets'}</h2>
            {accounts.map(account =>
                <AccountItem 
                    key={account.id}
                    account={account} 
                    isSelected={!!selectedAccountId && account.id === selectedAccountId}
                    onAccountSelected={onAccountSelected}
                    isRelinking={!!account.id && relinkingAccountIds.has(account.id)}
                    onRelinkTransactions={onRelinkTransactions}
                />
            )}
        </React.Fragment>
    );
};

export default BankAccounts;
