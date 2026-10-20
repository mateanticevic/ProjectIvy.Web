import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';

import api from 'api/main';
import { DatetimeInput } from 'components';

interface Props {
    carId: string;
    onClose: () => void;
    onSaved: () => void;
    toast: (title: string, message: string) => void;
}

export default function FuelingModal({ carId, onClose, onSaved, toast }: Props) {
    const [date, setDate] = useState(() => moment().format('YYYY-MM-DD'));
    const [amount, setAmount] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDateValid, setIsDateValid] = useState(true);
    const saving = useRef(false);
    const liters = Number(amount);
    const isValid = isDateValid && moment(date, 'YYYY-MM-DD', true).isValid() && Number.isFinite(liters) && liters > 0;

    const save = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid || saving.current) return;
        saving.current = true;
        setIsSaving(true);
        try {
            await api.car.postFueling(carId, { date, amountInLiters: liters });
        } catch {
            saving.current = false;
            setIsSaving(false);
            toast('Failed', 'Could not add fueling. Your entries have been kept. Please try again.');
            return;
        }
        onSaved();
    };

    return (
        <Modal show scrollable backdrop="static" keyboard={!isSaving} onHide={() => { if (!saving.current) onClose(); }} aria-labelledby="add-fueling-title">
            <Modal.Header closeButton={!isSaving}>
                <Modal.Title id="add-fueling-title">Add fueling</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save} className="d-flex flex-column overflow-hidden">
                <Modal.Body>
                    <fieldset disabled={isSaving}>
                        <Form.Group controlId="fueling-date" className="mb-3" onChangeCapture={event => {
                            setIsDateValid(moment((event.target as HTMLInputElement).value, 'YYYY-MM-DD', true).isValid());
                        }}>
                            <Form.Label>Date</Form.Label>
                            <DatetimeInput
                                value={date}
                                inputProps={{ id: 'fueling-date', disabled: isSaving }}
                                onChange={value => {
                                    setDate(value);
                                    setIsDateValid(moment(value, 'YYYY-MM-DD', true).isValid());
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="fueling-liters">
                            <Form.Label>Fuel volume</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" required min="0" step="any" value={amount} onChange={event => setAmount(event.target.value)} />
                                <InputGroup.Text>L</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </fieldset>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={isSaving} onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!isValid || isSaving}>
                        {isSaving && <Spinner size="sm" animation="border" className="me-2" role="status" aria-label="Saving fueling" />}
                        Save fueling
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
