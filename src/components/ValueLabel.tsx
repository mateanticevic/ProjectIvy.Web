import React from 'react';

type Props = {
    label: string,
    unit: string,
    value: number
}

const ValueLabel = ({ label, unit, value }: Props) => {

    return (
        <div>
            <h2 className="text-align-center margin-bottom-0 margin-top-10">{Math.ceil(value)} {unit}</h2>
            <p className="text-align-center">{label}</p>
        </div>
    );
};

export default ValueLabel;
