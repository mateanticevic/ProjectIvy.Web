import React from 'react';

interface Props {
    code: string;
    country: string;
}

export const FlagIcon = ({ code, country }: Props) => {
    return (<span className={`flag-icon flag-icon-${code.toLowerCase()}`} title={country}></span>);
}
