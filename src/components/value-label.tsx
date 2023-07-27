import React from 'react';

interface Props {
    label: string;
    round?: boolean;
    unit?: string;
    value: number;
}

const ValueLabel = ({ label, round, unit, value }: Props) => {

    const formattedValue = round ? Math.ceil(value) : value;

    return (
        <div>
            <h2 className="text-align-center margin-bottom-0 margin-top-10">{formattedValue} {unit}</h2>
            <p className="text-align-center">{label}</p>
        </div>
    );
};

export default ValueLabel;
