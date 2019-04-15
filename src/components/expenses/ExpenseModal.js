import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button, Row, Col, Modal } from 'react-bootstrap/lib';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = (props) => {

    const header = props.expense.id ? `Expense #${props.expense.id}` : 'New expense';

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="lg">
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExpenseForm common={props.common}
                    expense={props.expense}
                    cards={props.cards}
                    files={props.files}
                    deleteFile={props.deleteFile}
                    linkFile={expenseFile => props.linkFile(props.expense.id, expenseFile)}
                    vendorPois={props.vendorPois}
                    uploadFiles={props.uploadFiles}
                    onVendorChanged={props.onVendorChanged}
                    onChange={props.onChange} />
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col lg={6}>
                        <Button block bsStyle="primary" className="margin-top-10" onClick={props.onExpenseAdd}>
                            <FontAwesome name="save" /> Save
                        </Button>
                    </Col>
                    <Col lg={6}>
                        {!props.expense.id &&
                            <Button block bsStyle="primary" className="margin-top-10" onClick={props.onExpenseAddAnother}>Save & continue</Button>
                        }
                    </Col>
                </Row>


            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseModal;

ExpenseModal.propTypes = {
    isOpen: PropTypes.bool,
    currencies: PropTypes.array,
    expense: PropTypes.object,
    expenseTypes: PropTypes.array,
    vendors: PropTypes.array,
    vendorPois: PropTypes.array,
    onChange: PropTypes.func,
    onExpenseAdd: PropTypes.func,
    onExpenseAddAnother: PropTypes.func,
    onVendorChanged: PropTypes.func,
    onClose: PropTypes.func
};