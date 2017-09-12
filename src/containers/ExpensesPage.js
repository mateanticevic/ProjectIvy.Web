import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../actions/expensesActions';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import objectAssign from 'object-assign';

import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseModal from '../components/expenses/ExpenseModal';
import ExpensePanel from '../components/expenses/ExpensePanel';
import * as expenseMapper from '../mappers/expenseMapper';

class ExpensesPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    props.actions.getCurrencies();
    props.actions.getExpenses(props.expenses.filters);
    props.actions.getExpenseTypes({ hasChildren: false });
    props.actions.getVendors();
    props.actions.getPaymentTypes();
    props.actions.getCards();

    this.onExpenseSave = this.onExpenseSave.bind(this);
    this.onExpenseAddAnother = this.onExpenseAddAnother.bind(this);
    this.onExpenseChanged = this.onExpenseChanged.bind(this);
    this.onExpenseNew = this.onExpenseNew.bind(this);
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

  onExpenseNew(){
    this.props.actions.onNewExpense();
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

    const common = this.props.common;

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Panel header="Filters">
              <ExpenseFilters currencies={common.currencies}
                              expenseTypes={common.expenseTypes}
                              vendors={common.vendors}
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
                              onNewClick={this.onExpenseNew}
                              page={this.props.expenses.filters.page}
                              pageSize={this.props.expenses.filters.pageSize} />
              </Col>
            </Row>
          </Col>
        </Row>
        <ExpenseModal currencies={common.currencies}
                      expenseTypes={common.expenseTypes}
                      vendors={common.vendors}
                      vendorPois={this.props.expenses.vendorPois}
                      cards={this.props.expenses.cards}
                      paymentTypes={common.paymentTypes}
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

ExpensesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  expenses: PropTypes.object.isRequired,
  common: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    expenses: state.expenses,
    common: state.common
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);
