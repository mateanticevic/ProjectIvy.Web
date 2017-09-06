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
              <Datetime value={props.expense.date}
                        defaultValue={new Date()}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={x => props.onChange({date: x.format("YYYY-MM-DD")})} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>        
              <ControlLabel>Type</ControlLabel>
              <Select selected={props.expense.expenseTypeId} options={props.expenseTypes} onChange={x => props.onChange({expenseTypeId: x})} hideDefaultOption={true}/>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <Select selected={props.expense.vendorId} options={props.vendors} onChange={x => { props.onChange({vendorId: x}); props.onVendorChanged(x); }} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Poi</ControlLabel>
              <Select selected={props.expense.poiId} options={props.vendorPois} onChange={x => props.onChange({poiId: x})} hideDefaultOption={true} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <InputGroup>
                  <FormControl value={props.expense.amount} type="number" onChange={x => props.onChange({amount: x.target.value})} />
                  <InputGroup.Addon>{props.expense.currencyId}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Currency</ControlLabel>
              <Select selected={props.expense.currencyId} options={props.currencies} onChange={x => props.onChange({currencyId: x})} hideDefaultOption={true} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Payment type</ControlLabel>
              <Select selected={props.expense.paymentTypeId} options={props.paymentTypes} onChange={x => props.onChange({paymentTypeId: x})} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Card</ControlLabel>
              <Select selected={props.expense.cardId} options={props.cards} onChange={x => props.onChange({cardId: x})} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl value={props.expense.comment} type="text" onChange={x => props.onChange({comment: x.target.value})} />
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