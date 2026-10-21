import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { components } from 'types/ivy-types';
import { DatetimeInput } from 'components';

type Salary = components['schemas']['Salary'];
type SalaryBinding = components['schemas']['SalaryBinding'];
const amountFields = [
    ['gross', 'Gross'], ['grossTotal', 'Gross total'], ['net', 'Net'], ['netTotal', 'Net total'],
    ['medical', 'Medical'], ['tax', 'Tax'], ['travelExpenses', 'Travel expenses'], ['deductions', 'Deductions']
] as const;

interface Props {
    salary?: Salary;
    currencies: components['schemas']['Currency'][];
    defaultCurrencyId?: string;
    onClose: () => void;
    onSave: (binding: SalaryBinding) => Promise<void>;
}

export default function SalaryModal({ salary, currencies, defaultCurrencyId, onClose, onSave }: Props) {
    const [date, setDate] = useState(salary?.date ? salary.date.slice(0, 10) : moment().format('YYYY-MM-DD'));
    const [isDateValid, setIsDateValid] = useState(true);
    const [currencyId, setCurrencyId] = useState(salary?.currency?.id ?? defaultCurrencyId ?? '');
    const [amounts, setAmounts] = useState(() => Object.fromEntries(amountFields.map(([key]) => [key, salary?.[key]?.toString() ?? ''])));
    const [note, setNote] = useState(salary?.note ?? '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const pending = useRef(false);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (pending.current) return;
        if (!isDateValid || !moment(date, 'YYYY-MM-DD', true).isValid() || !currencies.some(currency => currency.id === currencyId)) {
            setError('Choose a valid date and currency.');
            return;
        }
        const binding: SalaryBinding = { date, currencyId, note: note || null };
        for (const [key] of amountFields) {
            const value = amounts[key].trim();
            if (value && !Number.isFinite(Number(value))) {
                setError('Enter valid amounts.');
                return;
            }
            if (key === 'deductions') binding.deductions = value ? Number(value) : null;
            else binding[key] = value ? Number(value) : 0;
        }
        pending.current = true;
        setSaving(true);
        setError('');
        try {
            await onSave(binding);
        } catch {
            setError('Could not save salary. Your values have been kept. Please try again.');
        } finally {
            pending.current = false;
            setSaving(false);
        }
    };

    return (
        <Modal show onHide={() => { if (!pending.current) onClose(); }} backdrop="static" size="lg" aria-labelledby="salary-modal-title">
            <Form onSubmit={submit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title id="salary-modal-title">{salary ? 'Edit salary' : 'Add salary'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <fieldset disabled={saving}>
                        <Row className="g-3">
                            <Col sm={6}>
                                <Form.Group controlId="salary-date" onChangeCapture={event => {
                                    setIsDateValid(moment((event.target as HTMLInputElement).value, 'YYYY-MM-DD', true).isValid());
                                }}>
                                    <Form.Label>Date</Form.Label>
                                    <DatetimeInput
                                        value={date}
                                        inputProps={{ id: 'salary-date', disabled: saving }}
                                        onChange={value => {
                                            setDate(value);
                                            setIsDateValid(moment(value, 'YYYY-MM-DD', true).isValid());
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="salary-currency">
                                    <Form.Label>Currency</Form.Label>
                                    <Form.Select required value={currencyId} onChange={event => setCurrencyId(event.target.value)}>
                                        <option value="">Choose currency</option>
                                        {currencies.map(currency => <option key={currency.id} value={currency.id!}>{currency.code} — {currency.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            {amountFields.map(([key, label]) => (
                                <Col sm={6} key={key}>
                                    <Form.Group controlId={`salary-${key}`}>
                                        <Form.Label>{label}</Form.Label>
                                        <Form.Control type="number" step="any" value={amounts[key]} onChange={event => setAmounts(previous => ({ ...previous, [key]: event.target.value }))} />
                                    </Form.Group>
                                </Col>
                            ))}
                            <Col xs={12}>
                                <Form.Group controlId="salary-note">
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={note} onChange={event => setNote(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </fieldset>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={saving} onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save salary'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
