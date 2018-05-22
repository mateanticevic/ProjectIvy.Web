import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

const Select = (props) => {

  const defaultOptionId = props.defaultOptionId ? props.defaultOptionId : null;
  const defaultOptionValue = props.defaultOptionValue ? props.defaultOptionValue : 'Any';

  let t = props.options && props.options[0] && props.options[0].id ? props.options : props.options.map(item => { return { id: item, name: item} });

  const options = t.map(option => <option key={option.id} value={option.id}>{option.name}</option>);

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
