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
                         vendors={props.vendors}
                         onChange={props.onChange} />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onExpenseAdd}>Add</Button>
            <Button onClick={props.onClose}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ExpenseModal;
