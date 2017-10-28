import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Select from '../common/Select';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const ExpenseFilters = (props) => {
  return (
    <div>
        <Row>
          <Col lg={12}>
            <ControlLabel>Currency</ControlLabel>
            <Select options={props.common.currencies} onChange={x => props.onChange({currencyId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Vendor</ControlLabel>
            <Select options={props.common.vendors} onChange={x => props.onChange({vendorId: x})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Type</ControlLabel>
            <Select options={props.common.expenseTypes} onChange={x => props.onChange({typeId: x})} />
          </Col>
        </Row>
    </div>
  );
};

ExpenseFilters.propTypes = {
  currencies: PropTypes.array,
  vendors: PropTypes.array,
  expenseTypes: PropTypes.array,
  onChange: PropTypes.func
};

export default ExpenseFilters;
