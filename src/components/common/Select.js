import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

const Select = (props) => {

  const options = props.options.map(function(option){
    return <option key={option.valueId} value={option.id}>{option.name}</option>;
  });

  return (
          <FormControl componentClass="select" onChange={e => props.onChange(e.target.value)} placeholder="select">
            {!props.hideDefaultOption &&
              <option value="select">Any</option>
            }
            {options}
          </FormControl>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Select;
