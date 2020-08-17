import React from 'react';

interface Props {
    className?: string;
    code: string;
    country: string;
    title?: string;
}

export const FlagIcon = ({ className, code, country, title }: Props) =>
    <span
        className={`flag-icon flag-icon-${code.toLowerCase()} ${className}`}
        title={title ?? country}>
    </span>;
