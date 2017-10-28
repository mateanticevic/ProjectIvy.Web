import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = (props) => {

    const header = props.expense.id ? `Expense #${props.expense.id}` : 'New expense';

  return (
    <Modal show={props.isOpen} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ExpenseForm common={props.common}
                         expense={props.expense}
                         cards={props.cards}
                         vendorPois={props.vendorPois}
                         onVendorChanged={props.onVendorChanged}
                         onChange={props.onChange} />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onExpenseAdd}>Save</Button>
            {!props.expense.id &&
                <Button onClick={props.onExpenseAddAnother}>Add another</Button>
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