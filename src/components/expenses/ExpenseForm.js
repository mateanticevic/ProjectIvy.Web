import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ControlLabel, FormControl, FormGroup, InputGroup, Glyphicon, Tabs, Tab } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import Select from '../common/Select';
import ExpenseFormFilesTab from './ExpenseFormFilesTab';
import Dropzone from 'react-dropzone';

const ExpenseForm = (props) => {

  return (
    <Tabs id="expenseFormTabs" defaultActiveKey={1}>
      <Tab eventKey={1} title="General">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Date</ControlLabel>
              <InputGroup>
                  <Datetime value={props.expense.date}
                            defaultValue={new Date()}
                            dateFormat="YYYY-MM-DD"
                            timeFormat={false}
                            onChange={x => props.onChange({date: x.format("YYYY-MM-DD")})} />
                  <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>      
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>        
              <ControlLabel>Type</ControlLabel>
              <Select selected={props.expense.expenseTypeId} options={props.common.expenseTypes} onChange={x => props.onChange({expenseTypeId: x})} hideDefaultOption={true}/>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <Select selected={props.expense.vendorId} options={props.common.vendors} onChange={x => { props.onChange({vendorId: x}); props.onVendorChanged(x); }} />
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
              <Select selected={props.expense.currencyId} options={props.common.currencies} onChange={x => props.onChange({currencyId: x})} hideDefaultOption={true} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Payment type</ControlLabel>
              <Select selected={props.expense.paymentTypeId} options={props.common.paymentTypes} onChange={x => props.onChange({paymentTypeId: x})} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Card</ControlLabel>
              <Select selected={props.expense.cardId} defaultOptionValue="N/A" options={props.cards} onChange={x => props.onChange({cardId: x})} />
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
      </Tab>
      <Tab eventKey={2} title="Currency">
        <Row>
            <Col lg={6}>
              <FormGroup>
                <ControlLabel>Exchange rate</ControlLabel>
                <InputGroup>
                    <FormControl value={props.expense.parentCurrencyExchangeRate} type="number" readOnly={!props.expense.parentCurrencyId} onChange={x => props.onChange({parentCurrencyExchangeRate: parseFloat(x.target.value)})} />
                    <InputGroup.Addon>{props.expense.currencyId} -> {props.expense.parentCurrencyId}</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <ControlLabel>Parent currency</ControlLabel>
                <Select selected={props.expense.parentCurrencyId}
                        options={props.common.currencies}
                        defaultOptionValue="No parent currency"
                        onChange={x => props.onChange({parentCurrencyId: x})} />
              </FormGroup>
            </Col>
          </Row>
      </Tab>
      <Tab eventKey={3} title="Files">
        <ExpenseFormFilesTab expense={props.expense} common={props.common} uploadFiles={props.uploadFiles} files={props.files} linkFile={props.linkFile} />
      </Tab>
      <Tab eventKey={4} title="Info">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Created</ControlLabel>
              <InputGroup>
                  <Datetime value={props.expense.created} inputProps={{readOnly:true}} />
                  <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>      
            </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <ControlLabel>Modified</ControlLabel>
                <InputGroup>
                    <Datetime value={props.expense.modified} inputProps={{readOnly:true}} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>   
              </FormGroup>
            </Col>
        </Row>
      </Tab>
    </Tabs>
  );
};

export default ExpenseForm;

ExpenseForm.propTypes = {
  expenseTypes: PropTypes.array,
  vendors: PropTypes.array,
  vendorPois: PropTypes.array,
  currencies: PropTypes.array,
  onChange: PropTypes.func,
  expense: PropTypes.object
};