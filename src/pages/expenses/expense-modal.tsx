import React from 'react';
import { Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import ButtonWithSpinner from 'components/button-with-spinner';
import ExpenseForm from './expense-form';
import { components } from 'types/ivy-types';
import { SelectOption } from 'types/common';

type Card = components['schemas']['Card'];
type Expense = components['schemas']['Expense'];
type FileType = components['schemas']['FileType'];

interface Props {
    cards: Card[],
    currencies: SelectOption[],
    descriptionSuggestions: string[],
    expense: Expense,
    files: any,
    fileTypes: FileType[],
    isOpen: boolean,
    isSaving: boolean,
    paymentTypes: SelectOption[],
    types: any,
    uploadFiles: any,
    vendorPois: any,
    deleteFile: () => void,
    onChange: () => void,
    onExpenseAdd: () => void,
    onClose: () => void,
    onVendorChanged: () => void,
    linkFile: (id: string, fileId: string, file: any) => void,
    uploadFile: () => void,
}

const ExpenseModal = ({ cards, currencies, expense, descriptionSuggestions, files, fileTypes, isOpen, isSaving, types, paymentTypes, uploadFiles, vendorPois, deleteFile, linkFile, onExpenseAdd, onChange, onClose, onVendorChanged, uploadFile }: Props) => {
    const header = expense.id ? `Expense #${expense.id}` : 'New expense';

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExpenseForm
                    cards={cards}
                    currencies={currencies}
                    deleteFile={deleteFile}
                    descriptionSuggestions={descriptionSuggestions}
                    expense={expense}
                    fileTypes={fileTypes}
                    files={files}
                    linkFile={(fileId, expenseFile) => linkFile(expense.id!, fileId, expenseFile)}
                    paymentTypes={paymentTypes}
                    types={types}
                    uploadFiles={uploadFiles}
                    vendorPois={vendorPois}
                    onVendorChanged={onVendorChanged}
                    onChange={onChange}
                    uploadFile={uploadFile}
                />
            </Modal.Body>
            <Modal.Footer>
                <ButtonWithSpinner
                    isLoading={isSaving}
                    onClick={() => onExpenseAdd(true)}
                >
                    <FontAwesome name="save" /> Save
                </ButtonWithSpinner>
            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseModal;
