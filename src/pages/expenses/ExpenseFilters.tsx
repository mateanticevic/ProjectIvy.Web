import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Row from 'react-bootstrap/lib/Row';
import Datetime from 'react-datetime';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

import { Currency } from 'types/expenses';
import { vendorLoader } from '../../utils/selectLoaders';
import moment from 'moment';

type Props = {
  currencies: Currency[];
  filters: any;
  types: any,
  onChange: () => void;
}

const ExpenseFilters = ({ currencies, filters, onChange, types }: Props) => {



  return (
    <div>
      <Row>
        <Col xs={6}>
          <ControlLabel>From</ControlLabel>
          <Datetime
            dateFormat="YYYY-M-D"
            timeFormat={false}
            onChange={x => x.format && onChange({ from: x.format('YYYY-M-D') })}
            value={filters.from}
          />
        </Col>
        <Col xs={6}>
          <ControlLabel>To</ControlLabel>
          <Datetime
            dateFormat="YYYY-M-D"
            timeFormat={false}
            onChange={x => x.format && onChange({ to: x.format('YYYY-M-D') })}
            value={filters.to}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Currency</ControlLabel>
          <ReactSelect
            isMulti
            options={currencies.map(x => { return { value: x.id, label: x.name } })}
            onChange={currencies => onChange({ currencyId: currencies ? currencies.map(x => x.value) : [] })}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Vendor</ControlLabel>
          <AsyncSelect
            loadOptions={vendorLoader}
            isMulti
            onChange={vendors => onChange({ vendorId: vendors ? vendors.map(x => x.value) : [] })}
            defaultOptions
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Type</ControlLabel>
          <ReactSelect
            isMulti
            options={types.map(x => { return { value: x.id, label: x.name } })}
            onChange={types => onChange({ typeId: types ? types.map(x => x.value) : [] })}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ExpenseFilters;
