import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Datetime from 'react-datetime';
import Select from '../common/Select';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const ExpenseFilters = (props) => {
  return (
    <div>
        <Row>
          <Col lg={12}>
            <ControlLabel>Currency</ControlLabel>
            <Select options={props.currencies} onChange={x => props.onChange({currencyId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Vendor</ControlLabel>
            <Select options={props.vendors} onChange={x => props.onChange({vendorId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Type</ControlLabel>
            <Select options={props.expenseTypes} onChange={x => props.onChange({typeId: x})} />
          </Col>
        </Row>
    </div>
  );
};

ExpenseFilters.propTypes = {
  currencies: PropTypes.array.isRequired,
  vendors: PropTypes.array.isRequired,
  expenseTypes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExpenseFilters;
