import React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap/lib';
import ReactSelect from 'react-select';

import { ExpenseFilters } from 'types/expenses';
import Select from '../../components/Select';

interface Props {
  cards: any;
  filters: ExpenseFilters;
  order: any;
  orderBy: any;
  paymentTypes: any;
  onChange: (filters: Partial<ExpenseFilters>) => void;
}

const daysofWeek = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
];

const FiltersMore = (props: Props) => {
  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl type="text" onChange={x => props.onChange({ description: x.target.value })} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Amount from</ControlLabel>
            <FormControl type="number" onChange={x => props.onChange({ amountFrom: x.target.value })} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Amount to</ControlLabel>
            <FormControl type="number" onChange={x => props.onChange({ amountTo: x.target.value })} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Order</ControlLabel>
            <Select options={props.orderBy} onChange={x => props.onChange({ orderBy: x })} hideDefaultOption={true} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>By&nbsp;</ControlLabel>
            <ToggleButtonGroup type="radio" name="options" value={props.filters.orderAscending} onChange={x => props.onChange({ orderAscending: x })}>
              <ToggleButton value="false">Descending</ToggleButton>
              <ToggleButton value="true">Ascending</ToggleButton>
            </ToggleButtonGroup>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Day of week</ControlLabel>
            <ReactSelect
              isMulti
              options={daysofWeek}
              onChange={days => props.onChange({ day: days ? days.map(x => x.value) : [] })}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Payment type</ControlLabel>
            <ReactSelect
              isMulti
              options={props.paymentTypes.map(x => ({ value: x.id, label: x.name }))}
              onChange={paymentTypes => props.onChange({ paymentTypeId: paymentTypes ? paymentTypes.map(x => x.value) : [] })}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Card</ControlLabel>
            <ReactSelect
              isMulti
              options={props.cards.map(x => ({ value: x.id, label: x.name }))}
              onChange={cards => props.onChange({ cardId: cards ? cards.map(x => x.value) : [] })}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Has linked files</ControlLabel>
            <ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={x => props.onChange({ hasLinkedFiles: x })}>
              <ToggleButton value="">Show all</ToggleButton>
              <ToggleButton value="true">Yes</ToggleButton>
              <ToggleButton value="false">No</ToggleButton>
            </ToggleButtonGroup>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Has poi</ControlLabel>
            <ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={x => props.onChange({ hasPoi: x })}>
              <ToggleButton value="">Show all</ToggleButton>
              <ToggleButton value="true">Yes</ToggleButton>
              <ToggleButton value="false">No</ToggleButton>
            </ToggleButtonGroup>
          </FormGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FiltersMore;
