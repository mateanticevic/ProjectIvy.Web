import React from 'react';
import { Alert, Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import api from 'api/main';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type AccountBinding = components['schemas']['AccountBinding'];

interface Props {
    account: AccountBinding;
    currencies: components['schemas']['Currency'][];
    isOpen: boolean;
    isSaving: boolean;
    saveFailed: boolean;
    onChange: (changed: Partial<AccountBinding>) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
}

const bankLoader = async (value: string) => {
    const banks = await api.bank.get({ Search: value });
    return banks.items.map(bank => ({ value: bank.id!, label: bank.name! }));
};

const AccountModal = ({ account, currencies, isOpen, isSaving, saveFailed, onChange, onClose, onSave }: Props) => {
    const reactSelectStyles = useReactSelectStyles();

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={isSaving ? undefined : onClose}
            keyboard={!isSaving}
            size="sm"
            aria-labelledby="new-account-title"
        >
            <Modal.Header closeButton={!isSaving}>
                <Modal.Title id="new-account-title">New Account</Modal.Title>
            </Modal.Header>
            <Form onSubmit={event => {
                event.preventDefault();
                void onSave();
            }}>
                <Modal.Body>
                    {saveFailed && <Alert variant="danger">Failed to create account. Please try again.</Alert>}
                    <fieldset className="form-grid" disabled={isSaving}>
                        <FloatingLabel controlId="new-account-name" label="Name">
                            <Form.Control
                                placeholder="Name"
                                value={account.name ?? ''}
                                onChange={event => onChange({ name: event.target.value })}
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="new-account-iban" label="IBAN (optional)">
                            <Form.Control
                                placeholder="IBAN"
                                value={account.iban ?? ''}
                                onChange={event => onChange({ iban: event.target.value })}
                            />
                        </FloatingLabel>
                        <Form.Group>
                            <Form.Label htmlFor="new-account-bank">Bank (optional)</Form.Label>
                            <AsyncSelect
                                inputId="new-account-bank"
                                defaultOptions
                                loadOptions={bankLoader}
                                onChange={bank => onChange({ bankId: bank?.value })}
                                isClearable
                                isDisabled={isSaving}
                                styles={reactSelectStyles}
                            />
                        </Form.Group>
                        <Form.Group controlId="new-account-currency">
                            <Form.Label>Currency</Form.Label>
                            <Form.Select
                                value={account.currencyId ?? ''}
                                onChange={event => onChange({ currencyId: event.target.value })}
                                required
                            >
                                <option value="">Select currency</option>
                                {currencies.map(currency => (
                                    <option key={currency.id} value={currency.id ?? ''}>{currency.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Check
                            type="switch"
                            id="new-account-active"
                            label="Active"
                            checked={account.active ?? true}
                            onChange={event => onChange({ active: event.target.checked })}
                        />
                    </fieldset>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving || !account.name?.trim() || !account.currencyId}>
                        {isSaving ? 'Saving...' : 'Create Account'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AccountModal;
