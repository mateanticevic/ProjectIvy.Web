import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import objectAssign from 'object-assign';

import ExpenseFilters from './ExpenseFilters';
import ExpenseModal from './ExpenseModal';
import ExpensePanel from './ExpensePanel';
import * as expenseMapper from '../../mappers/expenseMapper';

class ExpensesIndex extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.props.actions.getCurrencies();
    this.props.actions.getExpenses(props.expenses.filters);
    this.props.actions.getExpenseTypes({ hasChildren: false });
    this.props.actions.getVendors();
    this.props.actions.getPaymentTypes();
    this.props.actions.getCards();

    this.onExpenseSave = this.onExpenseSave.bind(this);
    this.onExpenseAddAnother = this.onExpenseAddAnother.bind(this);
    this.onExpenseChanged = this.onExpenseChanged.bind(this);
    this.onExpenseEdit = this.onExpenseEdit.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  onExpenseSave(){
    if(this.props.expenses.expense.id){
      this.props.actions.updateExpense(this.props.expenses.expense, this.props.expenses.filters);
    }
    else{
      this.props.actions.addExpense(this.props.expenses.expense, this.props.expenses.filters);
    }
  }

  onExpenseAddAnother(){
    this.props.actions.addExpenseAnother(this.props.expenses.expense, this.props.expenses.filters);
  }

  onExpenseChanged(expenseValue){
    let expense = objectAssign({}, this.props.expenses.expense, expenseValue);
    this.props.actions.changedExpense(expense);
  }

  onExpenseEdit(expense){
    this.props.actions.editExpense(expenseMapper.toBindingModel(expense));
    this.props.actions.openModal();
  }

  onFiltersChanged(filterValue){
    let filters = objectAssign({}, this.props.expenses.filters, filterValue);
    
    if(filterValue.page == undefined){
      filters.page = 1;
    }
    
    this.props.actions.changedFilters(filters);
  }

  render() {

    const registers = this.props.registers;

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Panel header="Filters">
              <ExpenseFilters currencies={registers.currencies}
                              expenseTypes={registers.expenseTypes}
                              vendors={registers.vendors}
                              onChange={this.onFiltersChanged} />
            </Panel>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <ExpensePanel expenses={this.props.expenses.expenses}
                              showButtons={true}
                              onEdit={this.onExpenseEdit}
                              onPageChange={this.onFiltersChanged}
                              onNewClick={this.props.actions.openModal}
                              page={this.props.expenses.filters.page}
                              pageSize={this.props.expenses.filters.pageSize} />
              </Col>
            </Row>
          </Col>
        </Row>
        <ExpenseModal currencies={registers.currencies}
                      expenseTypes={registers.expenseTypes}
                      vendors={registers.vendors}
                      vendorPois={this.props.expenses.vendorPois}
                      cards={this.props.expenses.cards}
                      paymentTypes={this.props.registers.paymentTypes}
                      expense={this.props.expenses.expense}
                      isOpen={this.props.expenses.isModalOpen}
                      onExpenseAdd={this.onExpenseSave}
                      onExpenseAddAnother={this.onExpenseAddAnother}
                      onVendorChanged={this.props.actions.onVendorChanged}
                      onClose={this.props.actions.closeModal}
                      onChange={this.onExpenseChanged} />
      </Grid>
    );
  }
}

export default ExpensesIndex;

ExpensesIndex.propTypes = {
  actions: React.PropTypes.object,
  expenses: React.PropTypes.object,
  registers: React.PropTypes.object
};