import React from 'react';
import { Col, FormLabel, FormControl, FormGroup, InputGroup, Row, Tab, Tabs, Badge } from 'react-bootstrap';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import { Expense } from 'types/expenses';
import { DateFormElement } from 'components';
import Select from 'components/Select';
import { vendorLoader } from 'utils/select-loaders';
import ExpenseFormFilesTab from './ExpenseFormFilesTab';

interface Props {
  cards: any;
  currencies: any;
  descriptionSuggestions: string[];
  expense: Expense;
  deleteFile: any;
  fileTypes: any;
  files: any;
  paymentTypes: any;
  types: any;
  linkFile: any;
  onChange: any;
  onVendorChanged: any;
  uploadFiles: any;
  vendorPois: any;
}

const ExpenseForm = ({ cards, currencies, deleteFile, descriptionSuggestions, expense, fileTypes, files, types, onChange, onVendorChanged, paymentTypes, uploadFile, vendorPois, linkFile }: Props) => {

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
              <FormLabel>Type</FormLabel>
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
              <FormLabel>Vendor</FormLabel>
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
              <FormLabel>Poi</FormLabel>
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
              <FormLabel>Currency</FormLabel>
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
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <FormControl
                  onChange={(x) => onChange({ amount: x.target.value })}
                  type="number"
                  value={expense.amount}
                />
                <InputGroup.Text id="basic-addon2">{expense.currency?.id}</InputGroup.Text>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <FormLabel>Payment type</FormLabel>
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
              <FormLabel>Card</FormLabel>
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
              <FormLabel>Description</FormLabel>
              <FormControl
                as="textarea"
                value={expense.comment}
                type="text"
                onChange={x => onChange({ comment: x.target.value })}
              />
              <div className="expense-form-description-suggestions">
                {descriptionSuggestions && !descriptionSuggestions.some(x => x === expense.comment) &&
                  descriptionSuggestions.map(suggestion =>
                    <Badge
                      className="item cursor-pointer"
                      onClick={() => onChange({ comment: suggestion })}
                      variant="secondary"
                    >
                      {suggestion}
                    </Badge>
                  )}
              </div>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={2} title="Currency">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <FormLabel>Parent currency</FormLabel>
              <Select
                selected={expense.parentCurrency?.id}
                options={currencies}
                defaultOptionValue="No parent currency"
                onChange={parentCurrencyId => onChange({ parentCurrency: { id: parentCurrencyId } })}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Installment reference</FormLabel>
              <FormControl
                value={expense.installmentRef}
                type="text"
                onChange={x => onChange({ installmentRef: x.target.value })}
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <FormLabel>Exchange rate</FormLabel>
              <InputGroup>
                <FormControl
                  value={expense.parentCurrencyExchangeRate}
                  type="number"
                  readOnly={!expense.parentCurrency?.id}
                  onChange={x => onChange({ parentCurrencyExchangeRate: parseFloat(x.target.value) })}
                />
                <InputGroup.Text>{expense.currency?.id} -> {expense.parentCurrency?.id}</InputGroup.Text>
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
          uploadFile={uploadFile}
        />
      </Tab>
      <Tab eventKey={4} title="Info">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <FormLabel>Created</FormLabel>
              <InputGroup>
                <Datetime value={expense.timestamp} inputProps={{ readOnly: true }} />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <FormLabel>Modified</FormLabel>
              <InputGroup>
                <Datetime value={expense.modified} inputProps={{ readOnly: true }} />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  );
};

export default ExpenseForm;
