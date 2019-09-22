import React from 'react';

const ValueLabel = props => {

    return (
        <div>
            <h2 className="text-align-center margin-bottom-0 margin-top-10">{props.value} {props.unit}</h2>
            <p className="text-align-center">{props.label}</p>
        </div>
    );
};

export default ValueLabel;