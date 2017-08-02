import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Datetime from 'react-datetime';
import Select from '../common/Select';

const ExpenseForm = (props) => {

  return (
    <div>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Date</ControlLabel>                
              <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({date: x.format("YYYY-MM-DD")})} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>        
              <ControlLabel>Type</ControlLabel>
              <Select options={props.expenseTypes} onChange={x => props.onChange({expenseTypeValueId: x})} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <Select options={props.vendors} onChange={x => { props.onChange({vendorValueId: x}); props.onVendorChanged(x); }} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Poi</ControlLabel>
              <Select options={props.vendorPois} onChange={x => props.onChange({poiId: x})} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <InputGroup>
                  <FormControl type="number" onChange={x => props.onChange({amount: x.target.value})} />
                  <InputGroup.Addon>{props.expense.currencyValueId}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Currency</ControlLabel>
              <Select options={props.currencies} onChange={x => props.onChange({currencyValueId: x})} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl type="text" onChange={x => props.onChange({comment: x.target.value})} />
            </FormGroup>
          </Col>
        </Row>
    </div>
  );
};

export default ExpenseForm;

ExpenseForm.propTypes = {
  expenseTypes: React.PropTypes.array,
  vendors: React.PropTypes.array,
  vendorPois: React.PropTypes.array,
  currencies: React.PropTypes.array,
  onChange: React.PropTypes.func,
  expense: React.PropTypes.object
};