import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Datetime from 'react-datetime';
import Select from '../common/Select';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const ExpenseFiltersMore = (props) => {
  return (
    <div>
        <Row>
          <Col lg={3}>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => props.onChange({ from: "2017-10-01", to: "2017-10-31" })}>Month</Button>
          </Col>
          <Col lg={2}>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => props.onChange({ from: "2017-01-01", to: "2017-12-31" })}>2017</Button>
          </Col>
          <Col lg={2}>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => props.onChange({ from: "2016-01-01", to: "2016-12-31" })}>2016</Button>
          </Col>
          <Col lg={2}>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => props.onChange({ from: "2015-01-01", to: "2015-12-31" })}>2015</Button>
          </Col>
          <Col lg={2}>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => props.onChange({ from: "2014-01-01", to: "2014-12-31" })}>2014</Button>
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
            <ControlLabel>From</ControlLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} onChange={x => props.onChange({from: x.format("YYYY-MM-DD")})} />
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
  currencies: PropTypes.array.isRequired,
  order: PropTypes.array.isRequired,
  orderBy: PropTypes.array.isRequired,
  vendors: PropTypes.array.isRequired,
  expenseTypes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExpenseFiltersMore;
