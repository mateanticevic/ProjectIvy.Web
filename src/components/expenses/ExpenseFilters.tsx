import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Datetime from 'react-datetime';
import Select from '../common/Select';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const ExpenseFilters = (props) => {
  return (
    <div>
        <Row>
          <Col xs={6}>
            <ControlLabel>From</ControlLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({from: x.format("YYYY-MM-DD")})} value={props.filters.from} />
          </Col>
          <Col xs={6}>
            <ControlLabel>To</ControlLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({to: x.format("YYYY-MM-DD")})} value={props.filters.to} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Currency</ControlLabel>
            <Select selected={props.filters.currencyId} options={props.currencies} onChange={x => props.onChange({currencyId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Vendor</ControlLabel>
            <Select selected={props.filters.vendorId} options={props.vendors} onChange={x => props.onChange({vendorId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Type</ControlLabel>
            <Select selected={props.filters.typeId} options={props.types} onChange={x => props.onChange({typeId: x})} />
          </Col>
        </Row>
    </div>
  );
};

export default ExpenseFilters;
