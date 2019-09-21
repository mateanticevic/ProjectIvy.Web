import React from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap/lib';
import moment from 'moment';
import _ from 'lodash';

import { cardApi, commonApi, currencyApi, expenseApi, expenseTypeApi, fileApi, userApi, vendorApi } from '../../api/main';

import { ChartBar } from '../../components/common';
import { boundMethod } from 'autobind-decorator';
import { Currency, Expense, ExpenseBinding } from 'types/expenses';
import ExpenseFilters from './ExpenseFilters';
import ExpenseFiltersMore from './ExpenseFiltersMore';
import ExpensePanel from './ExpensePanel';
import ExpenseCountGraph from './ExpenseCountGraph';
import ExpenseModal from './ExpenseModal';
import { Page } from '../Page';

type State = {
  cards: any[],
  currencies: Currency[],
  defaultCurrency: Currency,
  expense: Expense,
  expenses: Expense[],
  expensesAreLoading: boolean,
  files: any[],
  fileTypes: any[],
  filters: any,
  graphs: any,
  isSavingExpense: boolean,
  isModalOpen: boolean,
  orderBy: any,
  paymentTypes: any[],
  stats: any,
  types: any,
  vendors: any,
  vendorPois: any
}

class ExpensesPage extends Page<{}, State> {

  state: State = {
    cards: [],
    currencies: [],
    defaultCurrency: {},
    graphs: {
      count: [],
      sumByYear: [],
      sum: []
    },
    files: [],
    fileTypes: [],
    expense: {
      currencyId: "HRK",
      files: [],
      parentCurrencyId: null,
      paymentTypeId: "cash"
    },
    expenses: {
      count: 0,
      items: []
    },
    expensesAreLoading: true,
    isSavingExpense: false,
    filters: {
      from: moment().month(0).date(1).format("YYYY-MM-DD"), // YYYY-01-01
      pageSize: 10,
      page: 1
    },
    isModalOpen: false,
    order: [
      { id: "false", name: "Descending" },
      { id: "true", name: "Ascending" }
    ],
    orderBy: [
      { id: "date", name: "Date" },
      { id: "created", name: "Created" },
      { id: "modified", name: "Modified" },
      { id: "amount", name: "Amount" }
    ],
    paymentTypes: [],
    stats: {
      sum: 0,
      typeCount: 0,
      vendorCount: 0
    },
    types: [],
    vendors: [],
    vendorPois: []
  }

  componentDidMount() {
    this.onFiltersChanged();
    cardApi.get().then(cards => this.setState({ cards }));
    commonApi.getExpenseFileTypes().then(fileTypes => this.setState({ fileTypes }));
    commonApi.getPaymentTypes().then(paymentTypes => this.setState({ paymentTypes }));
    currencyApi.get().then(currencies => this.setState({ currencies }));
    expenseTypeApi.get().then(types => this.setState({ types }));
    vendorApi.get().then(vendors => this.setState({ vendors: vendors.items }));
    userApi.get().then(user => this.setState({ defaultCurrency: user.defaultCurrency }));
  }

  @boundMethod
  deleteFile(fileId) {
    fileApi.deleteFile(fileId).then(() => { });
  }

  @boundMethod
  linkExpenseFile() {
    expenseApi.postFile(expenseId, expenseFile.file.id, { name: expenseFile.name, typeId: expenseFile.type }).then(() => { });
  }

  newExpense(): Expense {
    return {
      amount: 0,
      comment: '',
      currency: this.state.defaultCurrency
    };
  }

  @boundMethod
  onExpenseSave(closeModal: boolean) {
    this.setState({ isSavingExpense: true });

    const saveMethod = this.state.expense.id ? expenseApi.put : expenseApi.post;

    saveMethod(this.getExpenseBinding()).then(() => {
      this.setState({ isModalOpen: !closeModal, isSavingExpense: false });
      this.onFiltersChanged();
    })
      .catch(() => this.setState({ isSavingExpense: false }));
  }

  @boundMethod
  onExpenseChanged(expenseValue) {
    console.log(expenseValue);
    this.setState({
      expense: {
        ...this.state.expense,
        ...expenseValue
      }
    });
  }

  @boundMethod
  onExpenseEdit(expense) {
    this.setState({
      expense,
      isModalOpen: true
    });
  }

  @boundMethod
  onExpenseNew() {
    this.setState({
      expense: this.newExpense(),
      isModalOpen: true
    });
  }

  @boundMethod
  onFiltersChanged(filterValue) {
    const filters = this.resolveFilters(this.state.filters, filterValue);
    this.pushHistoryState(filters);
    this.setState({
      expensesAreLoading: true,
      filters
    });

    expenseApi.get(filters).then(expenses => this.setState({
      expenses,
      expensesAreLoading: false
    }));

    expenseApi.getCountByMonth(filters).then(countByMonth => this.setState({
      graphs: {
        ...this.state.graphs,
        count: countByMonth
      }
    }));

    expenseApi.getSumByMonth(filters).then(sumByMonth => this.setState({
      graphs: {
        ...this.state.graphs,
        sum: sumByMonth
      }
    }));

    expenseApi.getSum(filters).then(sum => this.setState({ stats: { ...this.state.stats, sum } }));
    expenseApi.getTypeCount(filters).then(typeCount => this.setState({ stats: { ...this.state.stats, typeCount } }));
    expenseApi.getVendorCount(filters).then(vendorCount => this.setState({ stats: { ...this.state.stats, vendorCount } }));
  }

  @boundMethod
  onVendorSearch(value, callback) {
    vendorApi.get({ search: value, pageSize: 5 }).then(vendors => callback(vendors.items.map(vendor => { return { value: vendor.id, label: vendor.name } })));
  }

  getExpenseBinding(): ExpenseBinding {
    const e = this.state.expense;

    return {
      amount: e.amount,
      cardId: e.card ? e.card.id : undefined,
      comment: e.comment,
      currencyId: e.currency.id,
      expenseTypeId: e.expenseType.id,
      date: e.date,
      id: e.id,
      paymentTypeId: e.paymentType.id,
      poiId: e.poi ? e.poi.id : undefined,
      vendorId: e.vendor ? e.vendor.id : undefined
    }
  }

  render() {
    const chartSumData = _.reverse(_.map(this.state.graphs.sum, x => { return { value: x.data, key: moment(`${x.year}-${x.month}-1`).format("YYYY MMM") }; }));

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Filters</Panel.Heading>
                  <Panel.Body>
                    <ExpenseFilters
                      currencies={this.state.currencies}
                      vendors={this.state.vendors}
                      onVendorSearch={this.onVendorSearch}
                      types={this.state.types}
                      filters={this.state.filters}
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
                    <ExpenseFiltersMore
                      cards={this.state.cards}
                      paymentTypes={this.state.paymentTypes}
                      filters={this.state.filters}
                      order={this.state.order}
                      orderBy={this.state.orderBy}
                      onChange={this.onFiltersChanged} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <ExpensePanel
                  expenses={this.state.expenses}
                  defaultCurrency={this.state.defaultCurrency}
                  isLoading={this.state.expensesAreLoading}
                  onEdit={this.onExpenseEdit}
                  onPageChange={page => this.onFiltersChanged({ page: page })}
                  onNewClick={this.onExpenseNew}
                  page={this.state.filters.page}
                  stats={this.state.stats}
                  serverPaging
                  pageSize={this.state.filters.pageSize} />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Count</Panel.Heading>
                  <Panel.Body>
                    <ExpenseCountGraph data={this.state.graphs.count} />
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
        <ExpenseModal
          currencies={this.state.currencies}
          types={this.state.types}
          vendorPois={this.state.vendorPois}
          vendors={this.state.vendors}
          fileTypes={this.state.fileTypes}
          paymentTypes={this.state.paymentTypes}
          cards={this.state.cards}
          expense={this.state.expense}
          isOpen={this.state.isModalOpen}
          isSaving={this.state.isSavingExpense}
          files={this.state.files}
          linkFile={(expenseId, expenseFile) => this.linkExpenseFile(expenseId, expenseFile, this.state.filters)}
          deleteFile={this.deleteFile}
          onVendorSearch={this.onVendorSearch}
          onExpenseAdd={this.onExpenseSave}
          onExpenseAddAnother={this.onExpenseAddAnother}
          onVendorChanged={() => { }}
          uploadFiles={() => { }}
          onClose={() => this.setState({ isModalOpen: false })}
          onChange={this.onExpenseChanged} />
      </Grid>
    );
  }
}

export default ExpensesPage;
