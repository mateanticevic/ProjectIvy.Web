import React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup, Row, Tab, Tabs } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';
import Select from '../../components/Select';
import ExpenseFormFilesTab from './ExpenseFormFilesTab';

const ExpenseForm = (props) => {

  const { expense } = props;

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
                  onChange={(x) => props.onChange({ date: x.format('YYYY-MM-DD') })} />
                <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <Select selected={expense.expenseType && expense.expenseType.id || null} options={props.types} onChange={(x) => props.onChange({ expenseType: { id: x } })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <AsyncSelect
                loadOptions={props.onVendorSearch}
                onChange={(x) => props.onChange({ vendor: { id: x.value } })}
                defaultOptions
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Poi</ControlLabel>
              <Select selected={expense.poi && expense.poi.id || null} defaultOptionValue="N/A" options={props.vendorPois} onChange={(id) => props.onChange({ poi: { id } })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Currency</ControlLabel>
              <Select selected={expense.currency.id} options={props.currencies} onChange={(id) => props.onChange({ currency: { id } })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <InputGroup>
                <FormControl value={expense.amount} type="number" onChange={(x) => props.onChange({ amount: x.target.value })} />
                <InputGroup.Addon>{expense.currency.id}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Payment type</ControlLabel>
              <Select selected={expense.paymentType && expense.paymentType.id || null} options={props.paymentTypes} onChange={(id) => props.onChange({ paymentType: { id } })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Card</ControlLabel>
              <Select selected={expense.card && expense.card.id || null} defaultOptionValue="N/A" options={props.cards} onChange={(id) => props.onChange({ card: { id } })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl value={props.expense.comment} type="text" onChange={(x) => props.onChange({ comment: x.target.value })} />
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={2} title="Currency">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Parent currency</ControlLabel>
              <Select selected={expense.parentCurrency && expense.parentCurrency.id || null}
                options={props.currencies}
                defaultOptionValue="No parent currency"
                onChange={(x) => props.onChange({ parentCurrencyId: x })} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Exchange rate</ControlLabel>
              <InputGroup>
                <FormControl value={props.expense.parentCurrencyExchangeRate} type="number" readOnly={!props.expense.parentCurrencyId} onChange={(x) => props.onChange({ parentCurrencyExchangeRate: parseFloat(x.target.value) })} />
                <InputGroup.Addon>{props.expense.currencyId} -> {props.expense.parentCurrencyId}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={3} title="Files">
        <ExpenseFormFilesTab expense={props.expense}
          fileTypes={props.fileTypes}
          uploadFiles={props.uploadFiles}
          files={props.files}
          deleteFile={props.deleteFile}
          linkFile={props.linkFile} />
      </Tab>
      <Tab eventKey={4} title="Info">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Created</ControlLabel>
              <InputGroup>
                <Datetime value={props.expense.timestamp} inputProps={{ readOnly: true }} />
                <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Modified</ControlLabel>
              <InputGroup>
                <Datetime value={props.expense.modified} inputProps={{ readOnly: true }} />
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
