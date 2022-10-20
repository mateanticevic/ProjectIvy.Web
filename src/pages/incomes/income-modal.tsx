import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Datetime from 'react-datetime';
import { Currency } from 'types/expenses';
import { IncomeBinding, IncomeSource, IncomeType } from 'types/incomes';
import { FaCalendar } from 'react-icons/fa';
import moment from 'moment';

import Select from 'components/Select';

interface Props {
    currencies: Currency[];
    income: IncomeBinding;
    isOpen: boolean;
    sources: IncomeSource[];
    types: IncomeType[];
    onClose(): void;
    onChange(changed: Partial<IncomeBinding>): void;
    onSave(): Promise<void>;
}

const IncomeModal = ({ onClose, onChange, onSave, currencies, income, isOpen, sources, types }: Props) => {

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New income</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Date</FormLabel>
                    <InputGroup>
                        <Datetime
                            dateFormat="YYYY-MM-DD"
                            onChange={x => onChange({ date: moment(x).format('YYYY-MM-DD') })}
                            timeFormat={false}
                        />
                        <InputGroup.Text>
                            <FaCalendar />
                        </InputGroup.Text>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Description</FormLabel>
                    <FormControl
                        type="text"
                        onChange={x => onChange({ description: x.target.value })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Amount</FormLabel>
                    <InputGroup>
                        <FormControl
                            type="number"
                            onChange={x => onChange({ amount: Number.parseFloat(x.target.value) })}
                        />
                        <InputGroup.Text>{income.currencyId}</InputGroup.Text>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Currency</FormLabel>
                    <Select options={currencies} onChange={currencyId => onChange({ currencyId })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Source</FormLabel>
                    <Select options={sources} onChange={sourceId => onChange({ sourceId })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Type</FormLabel>
                    <Select options={types} onChange={typeId => onChange({ typeId })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => onSave().then(() => onClose())}>
                    <FontAwesome name="save" /> Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IncomeModal;
