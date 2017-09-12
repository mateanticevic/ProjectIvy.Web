import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

const Select = (props) => {

  const defaultOptionId = props.defaultOptionId ? props.defaultOptionId : null;
  const defaultOptionValue = props.defaultOptionValue ? props.defaultOptionValue : 'Any';

  const options = props.options.map(option => <option key={option.id} value={option.id}>{option.name}</option>);

  return (
          <FormControl value={props.selected} componentClass="select" onChange={e => props.onChange(e.target.value)} placeholder="select">
            {!props.hideDefaultOption &&
              <option value={defaultOptionId}>{defaultOptionValue}</option>
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
