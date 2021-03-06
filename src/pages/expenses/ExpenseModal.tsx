import React from 'react';
import { FormCheck, Col, Modal, Row } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import ButtonWithSpinner from '../../components/ButtonWithSpinner';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = (props) => {
    const header = props.expense.id ? `Expense #${props.expense.id}` : 'New expense';

    return (
        <Modal
            backdrop="static"
            show={props.isOpen}
            onHide={props.onClose}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExpenseForm
                    currencies={props.currencies}
                    descriptionSuggestions={props.descriptionSuggestions}
                    types={props.types}
                    vendors={props.vendors}
                    fileTypes={props.fileTypes}
                    paymentTypes={props.paymentTypes}
                    expense={props.expense}
                    cards={props.cards}
                    files={props.files}
                    deleteFile={props.deleteFile}
                    linkFile={(fileId, expenseFile) => props.linkFile(props.expense.id, fileId, expenseFile)}
                    vendorPois={props.vendorPois}
                    uploadFiles={props.uploadFiles}
                    onVendorChanged={props.onVendorChanged}
                    onChange={props.onChange}
                    uploadFile={props.uploadFile}
                />
            </Modal.Body>
            <Modal.Footer>
                <Col lg={6}>
                    <ButtonWithSpinner
                        isLoading={props.isSaving}
                        onClick={() => props.onExpenseAdd(true)}
                    >
                        <FontAwesome name="save" /> Save
                    </ButtonWithSpinner>
                </Col>
                <Col lg={6}>
                    <FormCheck type="checkbox" bsPrefix="pull-left"> Add another?</FormCheck>
                </Col>
            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseModal;
