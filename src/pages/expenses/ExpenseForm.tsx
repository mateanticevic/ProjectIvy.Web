import React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup, Row, Tab, Tabs } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import Select from '../../components/Select';
import ExpenseFormFilesTab from './ExpenseFormFilesTab';
import { ExpenseBinding } from 'types/expenses';
import { vendorLoader } from '../../utils/selectLoaders';

type Props = {
  cards: any,
  currencies: any,
  expense: ExpenseBinding,
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
            <FormGroup>
              <ControlLabel>Date</ControlLabel>
              <InputGroup>
                <Datetime value={expense.date}
                  defaultValue={new Date()}
                  dateFormat="YYYY-MM-DD"
                  timeFormat={false}
                  onChange={(x) => onChange({ date: x.format('YYYY-MM-DD') })} />
                <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <Select selected={expense.expenseTypeId} options={types} onChange={expenseTypeId => onChange({ expenseTypeId })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <AsyncSelect
                loadOptions={vendorLoader}
                onChange={x => onChange({ vendorId: x.value })}
                defaultValue={{value: expense.vendorId, label: expense.vendorId}}
                defaultOptions
              />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Poi</ControlLabel>
              <Select selected={expense.poiId} defaultOptionValue="N/A" options={vendorPois} onChange={poiId => onChange({ poiId })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Currency</ControlLabel>
              <Select selected={expense.currencyId} options={currencies} onChange={currencyId => onChange({ currencyId })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <InputGroup>
                <FormControl value={expense.amount} type="number" onChange={(x) => onChange({ amount: x.target.value })} />
                <InputGroup.Addon>{expense.currencyId}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Payment type</ControlLabel>
              <Select selected={expense.paymentTypeId} options={paymentTypes} onChange={paymentTypeId => onChange({ paymentTypeId })} hideDefaultOption={true} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Card</ControlLabel>
              <Select selected={expense.cardId} defaultOptionValue="N/A" options={cards} onChange={cardId => onChange({ cardId })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl value={expense.comment} type="text" onChange={x => onChange({ comment: x.target.value })} />
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={2} title="Currency">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Parent currency</ControlLabel>
              <Select selected={expense.parentCurrencyId}
                options={currencies}
                defaultOptionValue="No parent currency"
                onChange={(x) => onChange({ parentCurrencyId: x })} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Exchange rate</ControlLabel>
              <InputGroup>
                <FormControl value={expense.parentCurrencyExchangeRate} type="number" readOnly={!expense.parentCurrencyId} onChange={(x) => onChange({ parentCurrencyExchangeRate: parseFloat(x.target.value) })} />
                <InputGroup.Addon>{expense.currencyId} -> {expense.parentCurrencyId}</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey={3} title="Files">
        <ExpenseFormFilesTab expense={expense}
          fileTypes={fileTypes}
          uploadFiles={[]}
          files={files}
          deleteFile={deleteFile}
          linkFile={linkFile} />
      </Tab>
      <Tab eventKey={4} title="Info">
        <Row>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Created</ControlLabel>
              <InputGroup>
                <Datetime value={expense.timestamp} inputProps={{ readOnly: true }} />
                <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup>
              <ControlLabel>Modified</ControlLabel>
              <InputGroup>
                <Datetime value={expense.modified} inputProps={{ readOnly: true }} />
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
