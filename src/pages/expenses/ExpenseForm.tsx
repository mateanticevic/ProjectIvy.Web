import React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup, Row, Tab, Tabs } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import Select from '../../components/Select';
import ExpenseFormFilesTab from './ExpenseFormFilesTab';
import { Expense } from 'types/expenses';
import { vendorLoader } from '../../utils/selectLoaders';
import { DateFormElement } from '../../components';

type Props = {
  cards: any,
  currencies: any,
  expense: Expense,
  deleteFile: any,
  fileTypes: any,
  files: any,
  paymentTypes: any,
  types: any,
  linkFile: any,
  onChange: any,
  onVendorChanged: any,
  uploadFiles: any,
  vendorPois: any
}

const ExpenseForm = ({ cards, currencies, deleteFile, expense, fileTypes, files, types, onChange, onVendorChanged, paymentTypes, uploadFiles, vendorPois, linkFile }: Props) => {


  return (
    <Tabs id="expenseFormTabs" defaultActiveKey={1}>
      <Tab eventKey={1} title="General">
        <Row>
          <Col lg={6}>
            <DateFormElement
              label="Date"
              onChange={date => onChange({ date })}
              value={expense.date}
            />
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <Select
                hideDefaultOption={true}
                onChange={expenseTypeId => onChange({ expenseType: { id: expenseTypeId } })}
                options={types}
                selected={expense.expenseType.id}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <AsyncSelect
                loadOptions={vendorLoader}
                onChange={vendor => onChange({ vendor: { id: vendor.value } })}
                defaultValue={{ value: expense.vendor?.id, label: expense.vendor?.name }}
                defaultOptions
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Poi</ControlLabel>
              <Select
                selected={expense.poi?.id}
                defaultOptionValue="N/A"
                options={vendorPois}
                onChange={poiId => onChange({ poi: { id: poiId } })}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Currency</ControlLabel>
              <Select
                hideDefaultOption={true}
                onChange={currencyId => onChange({ currency: { id: currencyId } })}
                options={currencies}
                selected={expense.currency.id}
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <InputGroup>
                <FormControl
                  onChange={(x) => onChange({ amount: x.target.value })}
                  type="number"
                  value={expense.amount}
                />
                <InputGroup.Addon>{expense.currency?.id}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Payment type</ControlLabel>
              <Select
                hideDefaultOption={true}
                onChange={paymentTypeId => onChange({ paymentType: { id: paymentTypeId } })}
                options={paymentTypes}
                selected={expense.paymentType?.id}
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Card</ControlLabel>
              <Select
                defaultOptionValue="N/A"
                onChange={cardId => onChange({ card: { id: cardId } })}
                options={cards}
                selected={expense.card?.id}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                value={expense.comment}
                type="text"
                onChange={x => onChange({ comment: x.target.value })}
              />
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={2} title="Currency">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Parent currency</ControlLabel>
              <Select
                selected={expense.parentCurrency?.id}
                options={currencies}
                defaultOptionValue="No parent currency"
                onChange={parentCurrencyId => onChange({ parentCurrency: { id: parentCurrencyId } })}
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Exchange rate</ControlLabel>
              <InputGroup>
                <FormControl
                  value={expense.parentCurrencyExchangeRate}
                  type="number"
                  readOnly={!expense.parentCurrency?.id}
                  onChange={(x) => onChange({ parentCurrencyExchangeRate: parseFloat(x.target.value) })}
                />
                <InputGroup.Addon>{expense.currency?.id} -> {expense.parentCurrency?.id}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={3} title="Files">
        <ExpenseFormFilesTab
          expense={expense}
          fileTypes={fileTypes}
          uploadFiles={[]}
          files={files}
          deleteFile={deleteFile}
          linkFile={linkFile}
        />
      </Tab>
      <Tab eventKey={4} title="Info">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Created</ControlLabel>
              <InputGroup>
                <Datetime value={expense.timestamp} inputProps={{ readOnly: true }} />
                <InputGroup.Addon>
                  <Glyphicon glyph="calendar" />
                </InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Modified</ControlLabel>
              <InputGroup>
                <Datetime value={expense.modified} inputProps={{ readOnly: true }} />
                <InputGroup.Addon>
                  <Glyphicon glyph="calendar" />
                </InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  );
};

export default ExpenseForm;
