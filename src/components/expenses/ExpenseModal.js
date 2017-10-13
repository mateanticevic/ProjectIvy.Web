import React from 'react';
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