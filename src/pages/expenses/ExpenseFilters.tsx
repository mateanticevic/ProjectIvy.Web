import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Row from 'react-bootstrap/lib/Row';
import Datetime from 'react-datetime';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

const ExpenseFilters = (props) => {

   const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];
  return (
    <div>
      <Row>
        <Col xs={6}>
          <ControlLabel>From</ControlLabel>
          <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={(x) => props.onChange({ from: x.format('YYYY-MM-DD') })} value={props.filters.from} />
        </Col>
        <Col xs={6}>
          <ControlLabel>To</ControlLabel>
          <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={(x) => props.onChange({ to: x.format('YYYY-MM-DD') })} value={props.filters.to} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Currency</ControlLabel>
          <ReactSelect
            isMulti
            options={props.currencies.map(x => { return { value: x.id, label: x.name }})}
            onChange={currencies => props.onChange({ currencyId: currencies.map(x => x.value) })}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Vendor</ControlLabel>
          <AsyncSelect
            loadOptions={props.onVendorSearch}
            isMulti
            onChange={vendors => props.onChange({ vendorId: vendors.map(x => x.value) })}
            defaultOptions
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ControlLabel>Type</ControlLabel>
          <ReactSelect
            isMulti
            options={props.types.map(x => { return { value: x.id, label: x.name }})}
            onChange={types => props.onChange({ typeId: types.map(x => x.value) })}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ExpenseFilters;
