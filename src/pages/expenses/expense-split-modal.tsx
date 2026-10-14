import React, { useRef, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaSave } from 'react-icons/fa';
import api from 'api/main';
import { SelectOption } from 'types/common';
import { components } from 'types/ivy-types';
import ExpenseSplitRow, { SplitRow } from './expense-split-row';

type Expense = components['schemas']['Expense'];
type ExpenseSplitBinding = components['schemas']['ExpenseSplitBinding'];
type ExpenseSplitPartBinding = components['schemas']['ExpenseSplitPartBinding'];

interface Props {
    expense: Expense;
    types: SelectOption[];
    onClose: () => void;
    onSaved: () => void;
}

// Parse decimal money exactly, rejecting fractions smaller than one hundredth.
const toHundredths = (value: string): number | undefined => {
    if (!/^-?\d+(\.\d{1,2})?$/.test(value)) return undefined;
    const [whole, fraction = ''] = value.replace('-', '').split('.');
    const result = (Number(whole) * 100 + Number(fraction.padEnd(2, '0'))) * (value.startsWith('-') ? -1 : 1);
    return Number.isSafeInteger(result) ? result : undefined;
};

const ExpenseSplitModal = ({ expense, types, onClose, onSaved }: Props) => {
    const newRow = (key: number): SplitRow => ({
        key,
        amount: '',
        expenseTypeId: expense.expenseType?.id ?? '',
        comment: expense.comment ?? '',
    });
    const [rows, setRows] = useState<SplitRow[]>(() => [newRow(0), newRow(1)]);
    const nextKey = useRef(2);
    const saving = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string>();
    const original = toHundredths(expense.amount?.toFixed(2) ?? '') ?? 0;
    const amounts = rows.map(row => toHundredths(row.amount));
    const total = amounts.reduce<number>((sum, amount) => sum + (amount ?? 0), 0);
    const validAmounts = amounts.every(amount => amount !== undefined && amount !== 0 && Math.sign(amount) === Math.sign(original));
    const isValid = rows.length >= 2 && validAmounts && total === original && !!expense.id;
    const formatAmount = (amount: number) => `${(amount / 100).toFixed(2)} ${expense.currency?.code ?? ''}`;

    const save = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid || saving.current) return;
        saving.current = true;
        setIsSaving(true);
        setError(undefined);
        const parts: ExpenseSplitPartBinding[] = rows.map((row, index) => ({
            amount: amounts[index]! / 100,
            expenseTypeId: row.expenseTypeId || null,
            comment: row.comment,
        }));
        const payload: ExpenseSplitBinding = { ...parts[0], expenses: parts.slice(1) };
        try {
            await api.expense.postSplit(expense.id!, payload);
        } catch {
            setError('Could not split expense. Please try again.');
            saving.current = false;
            setIsSaving(false);
            return;
        }
        onSaved();
    };

    return (
        <Modal show scrollable backdrop="static" keyboard={!isSaving} onHide={() => { if (!saving.current) onClose(); }} size="lg" aria-labelledby="split-expense-title">
            <Modal.Header closeButton={!isSaving}>
                <Modal.Title id="split-expense-title">Split expense</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body>
                    <p>Original amount: <strong>{formatAmount(original)}</strong></p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <fieldset disabled={isSaving}>
                        {rows.map((row, index) => (
                            <ExpenseSplitRow
                                key={row.key}
                                row={row}
                                index={index}
                                types={types}
                                canRemove={rows.length > 2}
                                onChange={change => setRows(current => current.map(item => item.key === row.key ? { ...item, ...change } : item))}
                                onRemove={() => setRows(current => current.length > 2 ? current.filter(item => item.key !== row.key) : current)}
                            />
                        ))}
                        <Button variant="outline-primary" onClick={() => {
                            const row = newRow(nextKey.current++);
                            setRows(current => [...current, row]);
                        }}><FaPlus aria-hidden="true" /> Add item</Button>
                    </fieldset>
                    <div className="mt-3" aria-live="polite">
                        <div>Total: {formatAmount(total)}</div>
                        <div>Remaining: {formatAmount(original - total)}</div>
                    </div>
                    <Form.Text>Enter nonzero amounts with up to two decimal places and the same sign as the original. The total must match the original amount.</Form.Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={isSaving} onClick={onClose}>Cancel</Button>
                    <Button type="submit" aria-label="Save" disabled={!isValid || isSaving}>
                        {isSaving ? <Spinner size="sm" animation="border" role="status" aria-label="Saving" /> : <FaSave aria-hidden="true" />} Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ExpenseSplitModal;
