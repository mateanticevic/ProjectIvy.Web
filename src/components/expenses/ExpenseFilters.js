import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Datetime from 'react-datetime';
import Select from '../common/Select';

const ExpenseFilters = (props) => {
  return (
    <div>
        <ControlLabel>Currency</ControlLabel>
        <Select options={props.currencies} onChange={x => props.onChange({currencyId: x})} />
        <ControlLabel>Vendor</ControlLabel>
        <Select options={props.vendors} onChange={x => props.onChange({vendorId: x})} />
        <ControlLabel>Type</ControlLabel>
        <Select options={props.expenseTypes} onChange={x => props.onChange({typeId: x})} />
        <ControlLabel>To</ControlLabel>
        <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({to: x.format("YYYY-MM-DD")})} />
        <ControlLabel>From</ControlLabel>
        <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({from: x.format("YYYY-MM-DD")})} />
        <ControlLabel>Description</ControlLabel>
        <FormControl type="text" onChange={x => props.onChange({description: x.target.value})} />
        <ControlLabel>Amount from</ControlLabel>
        <FormControl type="number" onChange={x => props.onChange({amountFrom: x.target.value})} />
        <ControlLabel>Amount to</ControlLabel>
        <FormControl type="number" onChange={x => props.onChange({amountTo: x.target.value})} />
    </div>
  );
};

ExpenseFilters.propTypes = {
  currencies: PropTypes.array.isRequired,
  vendors: PropTypes.array.isRequired,
  expenseTypes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExpenseFilters;
