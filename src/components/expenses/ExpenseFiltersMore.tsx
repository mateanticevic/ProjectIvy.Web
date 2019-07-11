import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, FormControl, Row, Col, ToggleButtonGroup, ToggleButton, FormGroup } from 'react-bootstrap/lib';
import Select from '../common/Select';

const ExpenseFiltersMore = (props) => {
  return (
    <div>
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
            <Select selected={props.filters.orderAscending} options={props.common.order} onChange={x => props.onChange({orderAscending: x})} hideDefaultOption={true} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Payment type</ControlLabel>
            <Select options={props.common.paymentTypes} onChange={x => props.onChange({paymentTypeId: x})}  />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ControlLabel>Card</ControlLabel>
            <Select options={props.cards} onChange={x => props.onChange({cardId: x})}  />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Has linked files</ControlLabel>
              <ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={x => props.onChange({ hasLinkedFiles: x })}>
                <ToggleButton value={true}>Show all</ToggleButton>
                <ToggleButton value={true}>Yes</ToggleButton>
                <ToggleButton value={false}>No</ToggleButton>
              </ToggleButtonGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <FormGroup>
              <ControlLabel>Has poi</ControlLabel>
              <ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={x => props.onChange({ hasPoi: x })}>
                <ToggleButton value={true}>Show all</ToggleButton>
                <ToggleButton value={true}>Yes</ToggleButton>
                <ToggleButton value={false}>No</ToggleButton>
              </ToggleButtonGroup>
            </FormGroup>
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
