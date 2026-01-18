import React from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import ButtonWithSpinner from 'components/button-with-spinner';
import { components } from 'types/ivy-types';
import { brandLoader } from 'utils/select-loaders';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type InventoryItem = components['schemas']['InventoryItem'];
type InventoryItemBinding = components['schemas']['InventoryItemBinding'];

interface Props {
    binding: InventoryItemBinding;
    inventoryItem?: InventoryItem | null;
    isOpen: boolean;
    isSaving: boolean;
    onChange(changed: Partial<InventoryItemBinding>): void;
    onClose(): void;
    onSave(): void;
}

const InventoryModal = ({ binding, inventoryItem, isOpen, isSaving, onChange, onClose, onSave }: Props) => {
    const reactSelectStyles = useReactSelectStyles();
    const selectKey = inventoryItem?.id ?? 'new';

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>{inventoryItem?.id ? 'Edit inventory item' : 'New inventory item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <FormControl
                        placeholder="Name"
                        type="text"
                        value={binding.name ?? ''}
                        onChange={x => onChange({ name: x.target.value })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Brand</FormLabel>
                    <AsyncSelect
                        key={selectKey}
                        cacheOptions
                        defaultOptions
                        defaultValue={inventoryItem?.brand ? { value: inventoryItem.brand.id, label: inventoryItem.brand.name } : undefined}
                        isClearable
                        loadOptions={brandLoader}
                        onChange={(option) => onChange({ brandId: option?.value })}
                        placeholder="Search brands"
                        styles={reactSelectStyles}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <ButtonWithSpinner
                    isLoading={isSaving}
                    onClick={onSave}
                >
                    Save
                </ButtonWithSpinner>
            </Modal.Footer>
        </Modal>
    );
};

export default InventoryModal;
