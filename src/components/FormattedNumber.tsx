import React from 'react';

import * as formatHelper from '../utils/formatHelper';

interface Props {
    number: number;
}

export const FormattedNumber = ({ number }: Props) => {
    const formatted = formatHelper.number(number);

    return (
        <span title={number.toString()}>
            {`${formatted.number}${formatted.exponent}`}
        </span>
    );
}