import React from 'react';
import { Button, FormControl, FormGroup, FormLabel, Modal, FloatingLabel } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { Select } from 'components';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type AccountBinding = {
    name: string;
    iban?: string;
    bankId?: string;
    currencyId?: string;
};

interface Props {
    account: AccountBinding;
    currencies: components['schemas']['Currency'][];
    isOpen: boolean;
    onChange: (changed: Partial<AccountBinding>) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
}

const bankLoader = (value: string, callback: (options: any[]) => void) => {
    // Placeholder - you may need to implement an API call for banks
    // For now, returning empty array
    callback([]);
};

const AccountModal = ({ account, currencies, isOpen, onChange, onClose, onSave }: Props) => {
    const reactSelectStyles = useReactSelectStyles();
    const currencyOptions = currencies.map(c => ({
        id: c.id!,
        name: c.name!
    }));

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-grid">
                    <FloatingLabel label="Name">
                        <FormControl
                            type="text"
                            placeholder="Name"
                            value={account.name}
                            onChange={x => onChange({ name: x.target.value })}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="IBAN">
                        <FormControl
                            type="text"
                            placeholder="IBAN"
                            value={account.iban}
                            onChange={x => onChange({ iban: x.target.value })}
                        />
                    </FloatingLabel>
                    <FormGroup>
                        <FormLabel>Bank</FormLabel>
                        <AsyncSelect
                            defaultOptions
                            loadOptions={bankLoader}
                            onChange={x => onChange({ bankId: x?.value })}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Currency</FormLabel>
                        <Select
                            options={currencyOptions}
                            onChange={currencyId => onChange({ currencyId })}
                        />
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

export default AccountModal;
