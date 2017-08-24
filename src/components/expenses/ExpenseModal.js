import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ExpenseForm from './ExpenseForm';

const ExpenseModal = (props) => {
  return (
    <Modal show={props.isOpen}>
        <Modal.Header closeButton>
            <Modal.Title>New expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ExpenseForm currencies={props.currencies}
                         expense={props.expense}
                         expenseTypes={props.expenseTypes}
                         cards={props.cards}
                         paymentTypes={props.paymentTypes}
                         vendors={props.vendors}
                         vendorPois={props.vendorPois}
                         onVendorChanged={props.onVendorChanged}
                         onChange={props.onChange} />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onExpenseAdd}>Add</Button>
            <Button onClick={props.onExpenseAddAnother}>Add another</Button>
            <Button onClick={props.onClose}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ExpenseModal;

ExpenseModal.propTypes = {
    isOpen: React.PropTypes.bool,
    currencies: React.PropTypes.array,
    expense: React.PropTypes.object,
    expenseTypes: React.PropTypes.array,
    vendors: React.PropTypes.array,
    vendorPois: React.PropTypes.array,
    onChange: React.PropTypes.func,
    onExpenseAdd: React.PropTypes.func,
    onExpenseAddAnother: React.PropTypes.func,
    onVendorChanged: React.PropTypes.func,
    onClose: React.PropTypes.func
};