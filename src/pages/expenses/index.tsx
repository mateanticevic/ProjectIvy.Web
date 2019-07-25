import React from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap/lib';
import moment from 'moment';
import _ from 'lodash';

import * as urlHelper from '../../utils/urlHelper';
import * as cardApi from '../../api/main/card';
import * as fileApi from '../../api/main/file';
import * as commonApi from '../../api/main/common';
import * as currencyApi from '../../api/main/currency';
import * as expenseApi from '../../api/main/expense';
import * as expenseTypeApi from '../../api/main/expenseType';
import * as vendorApi from '../../api/main/vendor';

import { ChartBar } from '../../components/common';
import { boundMethod } from 'autobind-decorator';
import { Currency, Expense } from 'types/expenses';
import ExpenseFilters from './ExpenseFilters';
import ExpenseFiltersMore from './ExpenseFiltersMore';
import ExpensePanel from './ExpensePanel';
import ExpenseCountGraph from './ExpenseCountGraph';
import ExpenseModal from './ExpenseModal';

type State = {
  cards: any[],
  currencies: Currency[],
  graphs: any,
  files: any[],
  fileTypes: any[],
  expense: Expense,
  expenses: Expense[],
  filters: any,
  isModalOpen: boolean,
  orderBy: any,
  paymentTypes: any[],
  stats: any,
  types: any,
  vendors: any,
  vendorPois: any
}

class ExpensesPage extends React.Component<{}, State> {

  state = {
    cards: [],
    currencies: [],
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
      sum: null,
      types: null,
      vendors: null
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
  }

  @boundMethod
  deleteFile(fileId) {
    fileApi.deleteFile(fileId).then(() => { });
  }

  @boundMethod
  linkExpenseFile() {
    expenseApi.postFile(expenseId, expenseFile.file.id, { name: expenseFile.name, typeId: expenseFile.type }).then(() => { });
  }

  @boundMethod
  onExpenseSave() {
    if (this.props.expenses.expense.id) {
      expenseApi.put(this.state.expense).then(() => this.setState({ isModalOpen: false }));
    }
    else {
      expenseApi.post(this.state.expense).then(() => this.setState({ isModalOpen: false }));
    }
  }

  @boundMethod
  onExpenseAddAnother() {
  }

  @boundMethod
  onExpenseChanged(expenseValue) {
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
      expense: {},
      isModalOpen: true
    });
  }

  @boundMethod
  onFiltersChanged(filterValue) {
    const filters = filterValue ? { ...this.state.filters, ...filterValue } : { ...this.state.filters, ...(urlHelper.queryStringToJson(window.location.search)) };

    if (filterValue && filterValue.page == undefined) {
      filters.page = 1;
    }

    window.history.pushState(null, null, window.location.pathname + urlHelper.jsonToQueryString(filters));

    this.setState({ filters });

    expenseApi.get(filters).then(expenses => this.setState({ expenses }));
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
  }

  @boundMethod
  onVendorSearch(value, callback){
    console.log(value);
    vendorApi.get({ search: value, pageSize: 5 }).then(vendors => callback(vendors.items.map(vendor => { return { value: vendor.id, label: vendor.name } })));
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
                <ExpensePanel expenses={this.state.expenses}
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
          files={this.state.files}
          linkFile={(expenseId, expenseFile) => this.linkExpenseFile(expenseId, expenseFile, this.state.filters)}
          deleteFile={this.deleteFile}
          onVendorSearch={this.onVendorSearch}
          onExpenseAdd={this.onExpenseSave}
          onExpenseAddAnother={this.onExpenseAddAnother}
          onVendorChanged={() => {}}
          uploadFiles={() => {}}
          onClose={() => this.setState({ isModalOpen: false })}
          onChange={this.onExpenseChanged} />
      </Grid>
    );
  }
}

export default ExpensesPage;