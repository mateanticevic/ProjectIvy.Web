import React from 'react';
import PropTypes from 'prop-types';

const ValueLabel = (props) => {

    return (
        <div>
            <h2 className="text-align-center margin-bottom-0 margin-top-10">{props.value} {props.unit}</h2>
            <p className="text-align-center">{props.label}</p>
        </div>
    );
};

ValueLabel.propTypes = {
    label: PropTypes.string.isRequired,
    unit: PropTypes.string,
    value: PropTypes.number
  };

export default ValueLabel;