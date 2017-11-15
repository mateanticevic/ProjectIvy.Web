import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
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
            <Button bsStyle="primary" onClick={props.onExpenseAdd}>
                <FontAwesome name="save" /> Save
            </Button>
            {!props.expense.id &&
                <Button bsStyle="primary" onClick={props.onExpenseAddAnother}>Save & continue</Button>
            }
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