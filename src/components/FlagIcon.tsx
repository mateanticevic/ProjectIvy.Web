import React from 'react';

interface Props {
    className?: string;
    code: string;
    country: string;
}

export const FlagIcon = ({ className, code, country }: Props) => <span className={`flag-icon flag-icon-${code.toLowerCase()} ${className}`} title={country}></span>;
