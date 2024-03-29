import React from 'react';
import { Col, FormLabel, FormControl, FormGroup, Row, ToggleButton, ToggleButtonGroup, FloatingLabel, Form } from 'react-bootstrap';
import ReactSelect from 'react-select';

import { ExpenseFilters } from 'types/expenses';
import Select from 'components/select';

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
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Description"
                        className="mb-3"
                    >
                        <Form.Control type="text" placeholder="Description" onChange={x => props.onChange({ description: x.target.value })} />
                    </FloatingLabel>
                    <FormGroup>
                        <FormLabel>Amount from</FormLabel>
                        <FormControl type="number" onChange={x => props.onChange({ amountFrom: x.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Amount to</FormLabel>
                        <FormControl type="number" onChange={x => props.onChange({ amountTo: x.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Order</FormLabel>
                        <Select options={props.orderBy} onChange={x => props.onChange({ orderBy: x })} hideDefaultOption={true} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>By&nbsp;</FormLabel>
                        <ToggleButtonGroup
                            type="radio"
                            size="sm"
                            name="options"
                            value={props.filters.orderAscending}
                            onChange={x => props.onChange({ orderAscending: x })}
                        >
                            <ToggleButton id="radio-desc" value="false">Descending</ToggleButton>
                            <ToggleButton id="radio-asc" value="true">Ascending</ToggleButton>
                        </ToggleButtonGroup>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Day of week</FormLabel>
                        <ReactSelect
                            isMulti
                            options={daysofWeek}
                            onChange={days => props.onChange({ day: days ? days.map(x => x.value) : [] })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Payment type</FormLabel>
                        <ReactSelect
                            isMulti
                            options={props.paymentTypes.map(x => ({ value: x.id, label: x.name }))}
                            onChange={paymentTypes => props.onChange({ paymentTypeId: paymentTypes ? paymentTypes.map(x => x.value) : [] })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Card</FormLabel>
                        <ReactSelect
                            isMulti
                            options={props.cards.map(x => ({ value: x.id, label: x.name }))}
                            onChange={cards => props.onChange({ cardId: cards ? cards.map(x => x.value) : [] })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Has linked files</FormLabel>
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            defaultValue={null}
                            size="sm"
                            onChange={x => props.onChange({ hasLinkedFiles: x })}
                        >
                            <ToggleButton id="has-linked-files-all" value="">Show all</ToggleButton>
                            <ToggleButton id="has-linked-files-yes" value="true">Yes</ToggleButton>
                            <ToggleButton id="has-linked-files-no" value="false">No</ToggleButton>
                        </ToggleButtonGroup>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Has poi</FormLabel>
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            defaultValue={null}
                            onChange={x => props.onChange({ hasPoi: x })}
                            size="sm"
                        >
                            <ToggleButton id="has-poi-all" value="">Show all</ToggleButton>
                            <ToggleButton id="has-poi-yes" value="true">Yes</ToggleButton>
                            <ToggleButton id="has-poi-no" value="false">No</ToggleButton>
                        </ToggleButtonGroup>
                    </FormGroup>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default FiltersMore;
