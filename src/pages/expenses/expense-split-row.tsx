import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { SelectOption } from 'types/common';

export interface SplitRow {
    key: number;
    amount: string;
    expenseTypeId: string;
    comment: string;
}

interface Props {
    row: SplitRow;
    index: number;
    types: SelectOption[];
    canRemove: boolean;
    onChange: (change: Partial<SplitRow>) => void;
    onRemove: () => void;
}

const ExpenseSplitRow = ({ row, index, types, canRemove, onChange, onRemove }: Props) => (
    <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto fs-6 px-1">
            {index === 0 ? 'Item 1 (retained expense)' : `Item ${index + 1}`}
        </legend>
        <Row className="g-3">
            <Col sm={4}>
                <Form.Group controlId={`split-amount-${row.key}`}>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        required
                        value={row.amount}
                        onChange={event => onChange({ amount: event.target.value })}
                    />
                </Form.Group>
            </Col>
            <Col sm={8}>
                <Form.Group controlId={`split-type-${row.key}`}>
                    <Form.Label>Type</Form.Label>
                    <Form.Select value={row.expenseTypeId} onChange={event => onChange({ expenseTypeId: event.target.value })}>
                        <option value="">No type</option>
                        {types.map(type => <option key={type.id} value={type.id} disabled={type.disabled}>{type.name}</option>)}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col xs={12}>
                <Form.Group controlId={`split-comment-${row.key}`}>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control as="textarea" rows={2} value={row.comment} onChange={event => onChange({ comment: event.target.value })} />
                </Form.Group>
            </Col>
        </Row>
        {index > 0 &&
            <Button variant="outline-danger" size="sm" className="mt-3" disabled={!canRemove} onClick={onRemove} aria-label={`Remove item ${index + 1}`}>
                <FaTrash aria-hidden="true" /> Remove
            </Button>
        }
    </fieldset>
);

export default ExpenseSplitRow;
