import React from 'react';
import { Button, FormControl, FormLabel, FormGroup, Modal, FloatingLabel, InputGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { FaCalendar } from 'react-icons/fa';
import moment from 'moment';

type TransactionBinding = {
    amount: string;
    date: string;
};

interface Props {
    transaction: TransactionBinding;
    isOpen: boolean;
    onChange: (changed: Partial<TransactionBinding>) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
}

const TransactionModal = ({ transaction, isOpen, onChange, onClose, onSave }: Props) => {
    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-grid">
                    <FloatingLabel label="Amount">
                        <FormControl
                            type="number"
                            placeholder="Amount"
                            value={transaction.amount}
                            onChange={x => onChange({ amount: x.target.value })}
                        />
                    </FloatingLabel>
                    <FormGroup>
                        <FormLabel>Date</FormLabel>
                        <InputGroup>
                            <Datetime
                                dateFormat="YYYY-MM-DD"
                                onChange={x => onChange({ date: moment(x).format('YYYY-MM-DD') })}
                                timeFormat={false}
                                value={transaction.date}
                            />
                            <InputGroup.Text>
                                <FaCalendar />
                            </InputGroup.Text>
                        </InputGroup>
                    </FormGroup>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TransactionModal;
