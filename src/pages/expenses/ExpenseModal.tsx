import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import ButtonWithSpinner from '../../components/ButtonWithSpinner';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = (props) => {

    const header = props.expense.id ? `Expense #${props.expense.id}` : 'New expense';

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="lg">
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExpenseForm
                    currencies={props.currencies}
                    types={props.types}
                    onVendorSearch={props.onVendorSearch}
                    vendors={props.vendors}
                    fileTypes={props.fileTypes}
                    paymentTypes={props.paymentTypes}
                    expense={props.expense}
                    cards={props.cards}
                    files={props.files}
                    deleteFile={props.deleteFile}
                    linkFile={(expenseFile) => props.linkFile(props.expense.id, expenseFile)}
                    vendorPois={props.vendorPois}
                    uploadFiles={props.uploadFiles}
                    onVendorChanged={props.onVendorChanged}
                    onChange={props.onChange} />
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col lg={6}>
                        <ButtonWithSpinner isLoading={props.isSaving} onClick={() => props.onExpenseAdd(true)}>
                            <FontAwesome name="save" /> Save
                        </ButtonWithSpinner>
                    </Col>
                    <Col lg={6}>
                        {!props.expense.id &&
                            <Button block bsStyle="primary" onClick={props.onExpenseAddAnother}>Save & continue</Button>
                        }
                    </Col>
                </Row>

            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseModal;
