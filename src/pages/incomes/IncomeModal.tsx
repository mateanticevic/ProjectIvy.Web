import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Income, IncomeSource, IncomeType } from 'types/incomes';

import Select from '../../components/Select';

interface Props {
    isOpen: boolean;
    sources: IncomeSource[];
    types: IncomeType[];
    onClose(): void;
    onChange(changed: Partial<Income>): void;
}

const IncomeModal = ({ onClose, onChange, isOpen, sources, types }: Props) => {

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
                    <FormLabel>Description</FormLabel>
                    <FormControl
                        type="text"
                        onChange={x => onChange({ description: x.target.value })}
                    />
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
                <Button block variant="primary" onClick={() => { }}>
                    <FontAwesome name="save" /> Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IncomeModal;
