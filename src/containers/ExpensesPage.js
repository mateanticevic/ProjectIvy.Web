import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap/lib';
import BootstrapPanel from 'react-bootstrap/lib/Panel';

import * as actions from '../actions/expensesActions';
import * as init from '../actions/commonActions';
import * as expenseMapper from '../mappers/expenseMapper';

import { Panel, Widget } from '../components/common';
import { ExpenseModal, ExpenseFilters, ExpenseFiltersMore, ExpensePanel } from '../components/expenses'


class ExpensesPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    props.actions.getCurrencies();
    props.actions.getExpenseTypes();
    props.init.getVendors();
    props.init.getExpenseFileTypes();
    props.actions.getPaymentTypes();
    props.actions.getCards();
    this.onFiltersChanged();

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
    let expense = { ...this.props.expenses.expense, ...expenseValue };
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
    let filters = { ...this.props.expenses.filters, ...filterValue };
    
    if(filterValue && filterValue.page == undefined){
      filters.page = 1;
    }
    
    this.props.actions.changedFilters(filters);
  }

  render() {

    const { actions, common, expenses } = this.props;

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Row>
              <Col lg={12}>
                <Panel header="Filters">
                  <ExpenseFilters common={common}
                                  filters={expenses.filters}
                                  onChange={this.onFiltersChanged} />
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <BootstrapPanel header="More filters" collapsible>
                  <ExpenseFiltersMore common={common}
                                      orderBy={expenses.orderBy}
                                      onChange={this.onFiltersChanged} />
                </BootstrapPanel>
              </Col>
            </Row>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header="Stats">
                  <Row>
                    <Col lg={3}>
                      <Widget title="Total" value={expenses.stats.sum} unit="HRK" />
                    </Col>
                    <Col lg={3}>
                      <Widget title="Unique vendors" value={expenses.stats.vendors} />
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <ExpensePanel expenses={expenses.expenses}
                              onEdit={this.onExpenseEdit}
                              onPageChange={this.onFiltersChanged}
                              onNewClick={this.onExpenseNew}
                              page={expenses.filters.page}
                              serverPaging
                              pageSize={expenses.filters.pageSize} />
              </Col>
            </Row>
          </Col>
        </Row>
        <ExpenseModal common={common}
                      vendorPois={expenses.vendorPois}
                      cards={expenses.cards}
                      expense={expenses.expense}
                      isOpen={expenses.isModalOpen}
                      files={expenses.files}
                      linkFile={actions.linkExpenseFile}
                      deleteFile={actions.deleteFile}
                      onExpenseAdd={this.onExpenseSave}
                      onExpenseAddAnother={this.onExpenseAddAnother}
                      onVendorChanged={actions.onVendorChanged}
                      uploadFiles = {actions.uploadFiles}
                      onClose={actions.closeModal}
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
    actions: bindActionCreators(actions, dispatch),
    init: bindActionCreators(init, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);
