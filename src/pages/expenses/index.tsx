import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Grid, Panel, Row } from 'react-bootstrap/lib';
import { boundMethod } from 'autobind-decorator';

import api from '../../api/main';
import { Currency, Expense, ExpenseBinding, ExpenseFilters } from 'types/expenses';
import { ChartBar, RadioLabel } from '../../components';
import { Page } from '../Page';
import ExpenseCountGraph from './ExpenseCountGraph';
import Filters from './Filters';
import FiltersMore from './FiltersMore';
import ExpenseModal from './ExpenseModal';
import ExpensePanel from './ExpensePanel';
import { CountByChart } from './CountByChart';
import country from 'api/main/country';

interface State {
  cards: any[];
  currencies: Currency[];
  defaultCurrency: Currency;
  expense: Expense;
  expenses: Expense[];
  expensesAreLoading: boolean;
  files: any[];
  fileTypes: any[];
  filters: ExpenseFilters;
  graphs: any;
  isSavingExpense: boolean;
  isModalOpen: boolean;
  orderBy: any;
  paymentTypes: any[];
  stats: any;
  types: any;
  vendors: any;
  vendorPois: any;
}

enum GroupBy {
  ByYear,
  ByMonth,
  ByDayOfWeek,
  ByDay
}

class ExpensesPage extends Page<{}, State> {

  public state: State = {
    cards: [],
    currencies: [],
    defaultCurrency: {},
    graphs: {
      count: [],
      countByType: [],
      countByVendor: [],
      sumByYear: [],
      sum: [],
    },
    files: [],
    fileTypes: [],
    expense: {
      currencyId: 'HRK',
      files: [],
      parentCurrencyId: null,
      paymentTypeId: 'cash',
    },
    expenses: {
      count: 0,
      items: [],
    },
    expensesAreLoading: true,
    isSavingExpense: false,
    filters: {
      from: moment().month(0).date(1).format('YYYY-MM-DD'), // YYYY-01-01
      orderAscending: 'false',
      pageSize: 10,
      page: 1,
    },
    isModalOpen: false,
    order: [
      { id: 'false', name: 'Descending' },
      { id: 'true', name: 'Ascending' },
    ],
    orderBy: [
      { id: 'date', name: 'Date' },
      { id: 'created', name: 'Created' },
      { id: 'modified', name: 'Modified' },
      { id: 'amount', name: 'Amount' },
    ],
    paymentTypes: [],
    stats: {
      sum: 0,
      typeCount: 0,
      vendorCount: 0,
    },
    types: [],
    vendors: [],
    vendorPois: [],
  };

  public componentDidMount() {
    this.onFiltersChanged();
    api.card.get().then(cards => this.setState({ cards }));
    api.common.getExpenseFileTypes().then(fileTypes => this.setState({ fileTypes }));
    api.common.getPaymentTypes().then(paymentTypes => this.setState({ paymentTypes }));
    api.currency.get().then(currencies => this.setState({ currencies }));
    api.vendor.get().then(vendors => this.setState({ vendors: vendors.items }));
    api.user.get().then(user => this.setState({ defaultCurrency: user.defaultCurrency }));

    api.expenseType.get().then(types => this.setState({ types }));
  }

  @boundMethod
  public deleteFile(fileId) {
    api.file.deleteFile(fileId).then(() => { });
  }

  @boundMethod
  public linkExpenseFile() {
    api.expense
      .postFile(expenseId, expenseFile.file.id, { name: expenseFile.name, typeId: expenseFile.type })
      .then(() => { });
  }

  public newExpense(): Partial<Expense> {
    return {
      amount: 0,
      date: moment().format('YYYY-M-D'),
      comment: '',
      currency: this.state.defaultCurrency,
      expenseType: this.state.types[0],
      paymentType: this.state.paymentTypes[0],
    };
  }

  @boundMethod
  public onExpenseChanged(expenseValue: ExpenseBinding) {
    this.setState({
      expense: {
        ...this.state.expense,
        ...expenseValue,
      },
    });

    if (expenseValue && expenseValue.vendorId) {
      this.onVendorChange(expenseValue.vendorId);
    }
  }

  @boundMethod
  public onExpenseEdit(expense: Expense) {
    this.setState({
      expense: {
        ...expense,
        date: moment(expense.date).format('YYYY-M-D'),
      },
      files: expense.files,
      isModalOpen: true,
    });
  }

  @boundMethod
  public onExpenseNew() {
    this.setState({
      expense: this.newExpense(),
      isModalOpen: true,
    });
  }

  @boundMethod
  public onExpenseSave(closeModal: boolean) {
    this.setState({ isSavingExpense: true });

    const saveMethod = this.state.expense.id ? api.expense.put : api.expense.post;

    saveMethod(this.toExpenseBinding(this.state.expense))
      .then(() => {
        this.setState({ isModalOpen: !closeModal, isSavingExpense: false });
        this.onFiltersChanged();
      })
      .catch(() => this.setState({ isSavingExpense: false }));
  }

  @boundMethod
  public onFiltersChanged(changedFilters?: Partial<ExpenseFilters>) {
    const filters = this.resolveFilters(this.state.filters, changedFilters);
    this.pushHistoryState(filters);
    this.setState({
      expensesAreLoading: true,
      filters,
    });

    api.expense
      .get(filters)
      .then(expenses => this.setState({
        expenses,
        expensesAreLoading: false,
      }));

    api.expense
      .getCountByMonth(filters)
      .then(countByMonth => this.setState({
        graphs: {
          ...this.state.graphs,
          count: countByMonth,
        },
      }));

    api.expense
      .getSumByMonth(filters)
      .then(sumByMonth => this.setState({
        graphs: {
          ...this.state.graphs,
          sum: sumByMonth,
        },
      }));

    const pageAllFilters = {
      ...filters,
      pageAll: true
    };

    api.expense
      .getCountByVendor(pageAllFilters)
      .then(data => {
        const top = _.take(_.filter(data.items, item => item.by), 3);
        const other = _.difference(data.items, top);

        const chartData = top.map(x => { return { name: x.by.name, value: x.count } });

        if (other.length > 0) {
          chartData.push({ name: 'Other', value: _.sum(other.map(x => x.count)) });
        }

        this.setState({
          graphs: {
            ...this.state.graphs,
            countByVendor: chartData
          }
        });
      });

    api.expense
      .getCountByType(pageAllFilters)
      .then(data => {
        const top = _.take(_.filter(data.items, item => item.by), 3);
        const other = _.difference(data.items, top);

        const chartData = top.map(x => { return { name: x.by.name, value: x.count } });
        if (other.length > 0) {
          chartData.push({ name: 'Other', value: _.sum(other.map(x => x.count)) });
        }

        this.setState({
          graphs: {
            ...this.state.graphs,
            countByType: chartData
          }
        });
      });

    api.expense
      .getSum(filters)
      .then(sum => this.setState({ stats: { ...this.state.stats, sum } }));

    api.expense
      .getTypeCount(filters)
      .then(typeCount => this.setState({ stats: { ...this.state.stats, typeCount } }));

    api.expense
      .getVendorCount(filters)
      .then(vendorCount => this.setState({ stats: { ...this.state.stats, vendorCount } }));
  }

  @boundMethod
  private onCountByClick(groupBy: GroupBy) {
    let apiMethod;

    switch (groupBy) {
      case GroupBy.ByYear:
        apiMethod = api.expense.getCountByYear;
        break;
      case GroupBy.ByMonth:
        apiMethod = api.expense.getCountByMonth;
        break;
      case GroupBy.ByDayOfWeek:
        apiMethod = api.expense.getCountByDayOfWeek;
        break;
      case GroupBy.ByDay:
        apiMethod = api.expense.getCountByDay;
        break;
    }

    apiMethod(this.state.filters)
      .then(countBy => this.setState({
        graphs: {
          ...this.state.graphs,
          count: countBy,
        },
      }));
  }

  @boundMethod
  public onVendorChange(vendorId: string) {
    api.vendor.getPois(vendorId)
      .then(vendorPois => this.setState({ vendorPois }));
  }

  public toExpenseBinding(e: Expense): ExpenseBinding {
    return {
      amount: e.amount,
      cardId: e.card ? e.card.id : undefined,
      comment: e.comment,
      currencyId: e.currency.id,
      expenseTypeId: e.expenseType.id,
      date: e.date,
      timestamp: e.timestamp,
      parentCurrencyId: e.parentCurrency ? e.parentCurrency.id : undefined,
      parentCurrencyExchangeRate: e.parentCurrencyExchangeRate,
      modified: e.modified,
      id: e.id,
      paymentTypeId: e.paymentType.id,
      poiId: e.poi ? e.poi.id : undefined,
      vendorId: e.vendor ? e.vendor.id : undefined,
    };
  }

  public render() {
    const chartSumData = _.reverse(_.map(this.state.graphs.sum, x => ({ value: x.data, key: moment(`${x.year}-${x.month}-1`).format('YYYY MMM') })));

    const countByOptions = [
      { value: GroupBy.ByYear, name: 'By Year' },
      { value: GroupBy.ByMonth, name: 'By Month' },
      { value: GroupBy.ByDayOfWeek, name: 'By Week of Week' },
      { value: GroupBy.ByDay, name: 'By Day' },
    ];

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Filters</Panel.Heading>
                  <Panel.Body>
                    <Filters
                      currencies={this.state.currencies}
                      vendors={this.state.vendors}
                      types={this.state.types}
                      filters={this.state.filters}
                      onChange={this.onFiltersChanged}
                    />
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
                    <FiltersMore
                      cards={this.state.cards}
                      paymentTypes={this.state.paymentTypes}
                      filters={this.state.filters}
                      order={this.state.order}
                      orderBy={this.state.orderBy}
                      onChange={this.onFiltersChanged}
                    />
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
                  onPageChange={page => this.onFiltersChanged({ page })}
                  onNewClick={this.onExpenseNew}
                  page={this.state.filters.page}
                  pageSize={this.state.filters.pageSize}
                  serverPaging
                  stats={this.state.stats}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Toggle>Count</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <ExpenseCountGraph data={this.state.graphs.count} />
                  </Panel.Body>
                  <Panel.Footer>
                    <RadioLabel options={countByOptions} onSelect={this.onCountByClick} />
                  </Panel.Footer>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Toggle>Sum</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <ChartBar
                      unit=" kn"
                      data={chartSumData}
                    />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Toggle>By Type</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <CountByChart data={this.state.graphs.countByType} />
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>
                    <Panel.Toggle>By Vendor</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <CountByChart data={this.state.graphs.countByVendor} />
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
          onExpenseAdd={this.onExpenseSave}
          onExpenseAddAnother={this.onExpenseAddAnother}
          onVendorChanged={this.onVendorChange}
          uploadFiles={() => { }}
          onClose={() => this.setState({ isModalOpen: false })}
          onChange={this.onExpenseChanged}
        />
      </Grid>
    );
  }
}

export default ExpensesPage;
