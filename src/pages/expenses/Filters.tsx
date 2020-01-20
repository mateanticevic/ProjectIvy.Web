import moment from 'moment';
import React from 'react';
import { Col, ControlLabel, FormGroup } from 'react-bootstrap/lib';
import Row from 'react-bootstrap/lib/Row';
import Datetime from 'react-datetime';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

import { Currency } from 'types/expenses';
import { ExpenseFilters } from 'types/expenses';
import { vendorLoader } from '../../utils/selectLoaders';

interface Props {
  currencies: Currency[];
  filters: ExpenseFilters;
  types: any;
  onChange: (expenseFilters: Partial<ExpenseFilters>) => void;
}

const dateFormat = 'YYYY-M-D';

const isValidDate = (value: string | moment.Moment) => {
  return value == '' || value.format;
};

const parseDate = (value: string | moment.Moment) => {
  return value.format ? value.format(dateFormat) : '';
};

const Filters = ({ currencies, filters, onChange, types }: Props) => {

  return (
    <div>
      <Row>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>From</ControlLabel>
            <Datetime
              dateFormat={dateFormat}
              timeFormat={false}
              onChange={x => isValidDate(x) && onChange({ from: parseDate(x) })}
              value={filters.from}
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>To</ControlLabel>
            <Datetime
              dateFormat={dateFormat}
              timeFormat={false}
              onChange={x => isValidDate(x) && onChange({ to: parseDate(x) })}
              value={filters.to}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <FormGroup>
            <ControlLabel>Currency</ControlLabel>
            <ReactSelect
              isMulti
              options={currencies.map(x => ({ value: x.id, label: x.name }))}
              onChange={currencies => onChange({ currencyId: currencies ? currencies.map(x => x.value) : [] })}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Vendor</ControlLabel>
            <AsyncSelect
              loadOptions={vendorLoader}
              isMulti
              onChange={vendors => onChange({ vendorId: vendors ? vendors.map(x => x.value) : [] })}
              defaultOptions
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Type</ControlLabel>
            <ReactSelect
              isMulti
              options={types.map(x => ({ value: x.id, label: x.name }))}
              onChange={types => onChange({ typeId: types ? types.map(x => x.value) : [] })}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default Filters;
