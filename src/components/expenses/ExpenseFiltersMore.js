import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Datetime from 'react-datetime';
import Select from '../common/Select';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const ExpenseFiltersMore = (props) => {
  return (
    <div>
        <Row>
          <Col lg={12}>
            <ControlLabel>From</ControlLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({from: x.format("YYYY-MM-DD")})} value={props.filters.from} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>To</ControlLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({to: x.format("YYYY-MM-DD")})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Description</ControlLabel>
            <FormControl type="text" onChange={x => props.onChange({description: x.target.value})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Amount from</ControlLabel>
            <FormControl type="number" onChange={x => props.onChange({amountFrom: x.target.value})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Amount to</ControlLabel>
            <FormControl type="number" onChange={x => props.onChange({amountTo: x.target.value})} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Order by</ControlLabel>
            <Select options={props.orderBy} onChange={x => props.onChange({orderBy: x})} hideDefaultOption={true} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Order</ControlLabel>
            <Select options={props.common.order} onChange={x => props.onChange({orderAscending: x})} hideDefaultOption={true} />
          </Col>
        </Row>
    </div>
  );
};

ExpenseFiltersMore.propTypes = {
  currencies: PropTypes.array,
  order: PropTypes.array,
  orderBy: PropTypes.array,
  vendors: PropTypes.array,
  expenseTypes: PropTypes.array,
  onChange: PropTypes.func
};

export default ExpenseFiltersMore;
