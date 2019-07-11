import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap/lib';
import moment from 'moment';
import _ from 'lodash';

import * as actions from '../actions/expensesActions';
import * as init from '../actions/commonActions';
import * as expenseMapper from '../mappers/expenseMapper';
import * as urlHelper from '../utils/urlHelper';

import { ExpenseModal, ExpenseFilters, ExpenseFiltersMore, ExpensePanel, ExpenseCountGraph } from '../components/expenses';
import { ChartBar } from '../components/common';


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

  onExpenseSave() {
    if (this.props.expenses.expense.id) {
      this.props.actions.updateExpense(this.props.expenses.expense, this.props.expenses.filters);
    }
    else {
      this.props.actions.addExpense(this.props.expenses.expense, this.props.expenses.filters);
    }
  }

  onExpenseAddAnother() {
    this.props.actions.addExpenseAnother(this.props.expenses.expense, this.props.expenses.filters);
  }

  onExpenseChanged(expenseValue) {
    let expense = { ...this.props.expenses.expense, ...expenseValue };
    this.props.actions.changedExpense(expense);
  }

  onExpenseEdit(expense) {
    this.props.actions.editExpense(expenseMapper.toBindingModel(expense));
    this.props.actions.openModal();
  }

  onExpenseNew() {
    this.props.actions.onNewExpense();
    this.props.actions.openModal();
  }

  onFiltersChanged(filterValue) {

    let filters = filterValue ? { ...this.props.expenses.filters, ...filterValue } : { ...this.props.expenses.filters, ...(urlHelper.queryStringToJson(window.location.search)) };

    window.history.pushState(null, null, window.location.pathname + urlHelper.jsonToQueryString(filters));

    if (filterValue && filterValue.page == undefined) {
      filters.page = 1;
    }

    this.props.actions.changedFilters(filters, filterValue && filterValue.page ? true : false);
  }

  render() {

    const { actions, common, expenses } = this.props;

    const chartSumData = _.reverse(_.map(expenses.graphs.sum, x => { return { value: x.data, key: moment(`${x.year}-${x.month}-1`).format("YYYY MMM") }; }));

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Filters</Panel.Heading>
                  <Panel.Body>
                    <ExpenseFilters common={common}
                      filters={expenses.filters}
                      onChange={this.onFiltersChanged} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Toggle>More filters</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <ExpenseFiltersMore common={common}
                      cards={expenses.cards}
                      filters={expenses.filters}
                      orderBy={expenses.orderBy}
                      onChange={this.onFiltersChanged} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <ExpensePanel expenses={expenses.expenses}
                  onEdit={this.onExpenseEdit}
                  onPageChange={page => this.onFiltersChanged({ page: page })}
                  onNewClick={this.onExpenseNew}
                  page={expenses.filters.page}
                  stats={expenses.stats}
                  serverPaging
                  pageSize={expenses.filters.pageSize} />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Count</Panel.Heading>
                  <Panel.Body>
                    <ExpenseCountGraph data={expenses.graphs.count} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Sum</Panel.Heading>
                  <Panel.Body>
                    <ChartBar unit=" kn"
                              data={chartSumData} />
                  </Panel.Body>
                </Panel>
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
          linkFile={(expenseId, expenseFile) => actions.linkExpenseFile(expenseId, expenseFile, expenses.filters)}
          deleteFile={actions.deleteFile}
          onExpenseAdd={this.onExpenseSave}
          onExpenseAddAnother={this.onExpenseAddAnother}
          onVendorChanged={actions.onVendorChanged}
          uploadFiles={actions.uploadFiles}
          onClose={actions.closeModal}
          onChange={this.onExpenseChanged} />
      </Grid>
    );
  }
}

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
