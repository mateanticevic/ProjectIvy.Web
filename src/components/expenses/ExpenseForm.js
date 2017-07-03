import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Datetime from 'react-datetime';
import Select from '../common/Select';

const ExpenseForm = (props) => {
  return (
    <div>
        <ControlLabel>Description</ControlLabel>
        <FormControl type="text" onChange={x => props.onChange({comment: x.target.value})} />
        <ControlLabel>Date</ControlLabel>                
        <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({date: x.format("YYYY-MM-DD")})} />                
        <ControlLabel>Type</ControlLabel>
        <Select options={props.expenseTypes} onChange={x => props.onChange({expenseTypeValueId: x})} />
        <ControlLabel>Vendor</ControlLabel>
        <Select options={props.vendors} onChange={x => props.onChange({vendorValueId: x})} />
        <ControlLabel>Currency</ControlLabel>
        <Select options={props.currencies} onChange={x => props.onChange({currencyValueId: x})} />
        <FormGroup>
        <ControlLabel>Amount</ControlLabel>
        <InputGroup>
            <FormControl type="number" onChange={x => props.onChange({amount: x.target.value})} />
            <InputGroup.Addon>{props.expense.currencyValueId}</InputGroup.Addon>
        </InputGroup>
        </FormGroup>
    </div>
  );
};

export default ExpenseForm;

ExpenseForm.propTypes = {
  expenseTypes: React.PropTypes.array,
  vendors: React.PropTypes.array,
  currencies: React.PropTypes.array,
  onChange: React.PropTypes.func,
  expense: React.PropTypes.object
};