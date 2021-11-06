import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Container, Card, Row, Accordion, Button } from 'react-bootstrap';

import api from 'api/main';
import { DistributionCard } from 'components';
import { GroupByTime } from 'consts/groupings';
import { Page } from 'pages/Page';
import { PagedList } from 'types/common';
import { Currency, Expense, ExpenseBinding, ExpenseFilters, ExpenseFile } from 'types/expenses';
import ExpenseModal from './ExpenseModal';
import FiltersMore from './FiltersMore';
import Filters from './Filters';
import ExpenseLinkModal from './ExpenseLinkModal';
import DayExpenses from './day-expenses';
import NumbersCard from './numbers-card';
import InfiniteScroll from 'react-infinite-scroll-component';

interface State {
    cards: any[];
    currencies: Currency[];
    defaultCurrency: Currency;
    descriptionSuggestions: string[];
    expense: Expense;
    expenses: PagedList<Expense>;
    expensesAreLoading: boolean;
    files: any[];
    fileTypes: any[];
    filters: ExpenseFilters;
    graphs: any;
    isSavingExpense: boolean;
    isModalOpen: boolean;
    isLinkModalOpen: boolean;
    layoutMode: LayoutMode;
    orderBy: any;
    paymentTypes: any[];
    stats: any;
    selectedExpenseId?: string;
    selectedTripId?: string;
    sumByCurrency: any;
    sumChartData: any;
    sumGroupBy: GroupByTime;
    types: any;
    vendors: any;
    vendorPois: any;
}

const sumByOptions = [
    { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
    { value: GroupByTime.ByMonth, name: 'Month' },
    { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
    { value: GroupByTime.ByYear, name: 'Year' },
];

const maps = {
    [GroupByTime.ByYear]: api.expense.getSumByYear,
    [GroupByTime.ByDayOfWeek]: api.expense.getSumByDayOfWeek,
    [GroupByTime.ByMonthOfYear]: api.expense.getSumByMonthOfYear,
    [GroupByTime.ByMonth]: api.expense.getSumByMonth,
};

class ExpensesPage extends Page<{}, State> {
    state: State = {
        cards: [],
        currencies: [],
        defaultCurrency: {},
        descriptionSuggestions: [],
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
        files: [],
        fileTypes: [],
        filters: {
            from: moment().month(0).date(1).format('YYYY-MM-DD'), // YYYY-01-01
            orderAscending: 'false',
            pageSize: 10,
            page: 1,
        },
        graphs: {
            countByType: [],
            countByVendor: [],
        },
        isSavingExpense: false,
        isLinkModalOpen: false,
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
        sumChartData: [],
        sumByCurrency: [],
        sumGroupBy: GroupByTime.ByMonthOfYear,
        types: [],
        vendors: [],
        vendorPois: [],
    };

    componentDidMount() {
        this.onFiltersChanged();
        api.card.get().then(cards => this.setState({ cards }));
        api.common.getExpenseFileTypes().then(fileTypes => this.setState({ fileTypes }));
        api.common.getPaymentTypes().then(paymentTypes => this.setState({ paymentTypes }));
        api.currency.get().then(currencies => this.setState({ currencies }));
        api.vendor.get().then(vendors => this.setState({ vendors: vendors.items }));
        api.user.get().then(user => this.setState({ defaultCurrency: user.defaultCurrency }));
        api.expenseType.get().then(types => this.setState({ types }));
    }

    render() {
        const countByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
            { value: GroupByTime.ByDay, name: 'Day' },
        ];

        const { expenses, sumByCurrency } = this.state;
        const { vendorCount, typeCount, sum } = this.state.stats;

        const expensesByDay = _.groupBy(expenses.items, expense => expense.date);
        const days = Object.keys(expensesByDay);

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>Filters</Card.Header>
                                    <Card.Body>
                                        <Filters
                                            currencies={this.state.currencies}
                                            vendors={this.state.vendors}
                                            types={this.state.types}
                                            filters={this.state.filters}
                                            onChange={this.onFiltersChanged}
                                        />
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    More filters
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <FiltersMore
                                                        cards={this.state.cards}
                                                        paymentTypes={this.state.paymentTypes}
                                                        filters={this.state.filters}
                                                        order={this.state.order}
                                                        orderBy={this.state.orderBy}
                                                        onChange={this.onFiltersChanged}
                                                    />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Card.Body>
                                </Card>
                                <div className="form-grid">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={this.onExpenseNew}>
                                        New
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={6}>
                        <InfiniteScroll
                            dataLength={expenses.items.length}
                            next={this.getNextPage}
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            {days.map(day =>
                                <DayExpenses
                                    key={day}
                                    day={day}
                                    expenses={expensesByDay[day]}
                                    onExpenseClick={this.onExpenseEdit}
                                />
                            )}
                        </InfiniteScroll>
                    </Col>
                    <Col lg={3}>
                        <DistributionCard
                            countByOptions={sumByOptions}
                            data={this.state.sumChartData}
                            name="Sum"
                            unit="kn"
                            onGroupByChange={this.onSumGroupBy}
                        />
                        <NumbersCard
                            expenseCount={expenses.count}
                            vendorCount={vendorCount}
                            typeCount={typeCount}
                            sum={sum}
                            sumByCurrency={sumByCurrency}
                        />
                    </Col>
                </Row>
                <ExpenseLinkModal
                    isOpen={this.state.isLinkModalOpen}
                    onClose={() => this.setState({ isLinkModalOpen: false })}
                    onLink={this.onExpenseLink}
                    onTripChange={({ value }) => this.setState({ selectedTripId: value })}
                />
                <ExpenseModal
                    currencies={this.state.currencies}
                    descriptionSuggestions={this.state.descriptionSuggestions}
                    types={this.state.types}
                    vendorPois={this.state.vendorPois}
                    vendors={this.state.vendors}
                    fileTypes={this.state.fileTypes}
                    paymentTypes={this.state.paymentTypes}
                    cards={this.state.cards}
                    expense={this.state.expense}
                    isOpen={this.state.isModalOpen}
                    isSaving={this.state.isSavingExpense}
                    files={this.state.expense?.files ?? []}
                    linkFile={this.linkExpenseFile}
                    deleteFile={this.deleteFile}
                    onChange={this.onExpenseChanged}
                    onClose={() => this.setState({ isModalOpen: false })}
                    onExpenseAdd={this.onExpenseSave}
                    onExpenseAddAnother={this.onExpenseAddAnother}
                    onVendorChanged={this.onVendorChange}
                    uploadFile={this.uploadFile}
                />
            </Container>
        );
    }

    deleteFile = (fileId) => {
        api.file.deleteFile(fileId);
    }

    getNextPage = () => {
        this.onFiltersChanged({
            page: this.state.filters.page + 1,
        });
    }

    linkExpenseFile = (expenseId: string, fileId: string, expenseFile: ExpenseFile) =>
        api.expense
            .postFile(expenseId, fileId, expenseFile)
            .then(() => {
                this.onFiltersChanged(undefined, true);
            });

    newExpense = (): Partial<Expense> => {
        return {
            amount: 0,
            comment: '',
            currency: this.state.defaultCurrency,
            date: moment().format('YYYY-M-D'),
            expenseType: this.state.types[0],
            paymentType: this.state.paymentTypes[0],
        };
    }

    onExpenseChanged = (expenseValue: ExpenseBinding) => {
        this.setState({
            expense: {
                ...this.state.expense,
                ...expenseValue,
            },
        }, () => {
            api.expense
                .getTopDescriptions({
                    description: this.state.expense.comment,
                    typeId: this.state.expense.expenseType.id,
                })
                .then(descriptionSuggestions => this.setState({ descriptionSuggestions }));
        });

        if (expenseValue && expenseValue.vendorId) {
            this.onVendorChange(expenseValue.vendorId);
        }
    }

    onExpenseLinkClick = (expenseId: string) => {
        this.setState({
            isLinkModalOpen: true,
            selectedExpenseId: expenseId,
        });
    }

    onExpenseEdit = (expense: Expense) => {
        this.setState({
            expense: {
                ...expense,
                date: moment(expense.date).format('YYYY-M-D'),
            },
            files: expense.files,
            isModalOpen: true,
        });
    }

    onExpenseNew = () => {
        this.setState({
            expense: this.newExpense(),
            isModalOpen: true,
        });
    }

    onExpenseSave = (closeModal: boolean) => {
        this.setState({ isSavingExpense: true });

        const saveMethod = this.state.expense.id ? api.expense.put : api.expense.post;

        saveMethod(this.toExpenseBinding(this.state.expense))
            .then(() => {
                this.setState({ isModalOpen: !closeModal, isSavingExpense: false });
                this.onFiltersChanged();
            })
            .catch(() => this.setState({ isSavingExpense: false }));
    }

    onFiltersChanged = (changedFilters?: Partial<ExpenseFilters>, silent = false) => {
        const filters = this.resolveFilters(this.state.filters, changedFilters);

        const state = {...filters};
        delete state.page;
        delete state.pageSize;

        this.pushHistoryState(state);
        this.setState({
            expensesAreLoading: !silent,
            filters,
        }, () => {
            this.onSumGroupBy(this.state.sumGroupBy);
        });

        const pageChanged = !!changedFilters?.page;

        api.expense
            .get(filters)
            .then(expenses => {
                this.setState({
                    expenses: pageChanged ? {
                        count: expenses.count,
                        items: [...this.state.expenses.items, ...expenses.items],
                    } : expenses,
                    expensesAreLoading: false,
                });
            });

        api.expense
            .getSum(filters)
            .then(sum => this.setState({ stats: { ...this.state.stats, sum } }));

        api.expense
            .getSumByCurrency(filters)
            .then(sumByCurrency => this.setState({ sumByCurrency }));

        api.expense
            .getTypeCount(filters)
            .then(typeCount => this.setState({ stats: { ...this.state.stats, typeCount } }));

        api.expense
            .getVendorCount(filters)
            .then(vendorCount => this.setState({ stats: { ...this.state.stats, vendorCount } }));
    }

    onSumGroupBy = (groupBy: GroupByTime) => {
        this.setState({ sumGroupBy: groupBy });
        maps[groupBy](this.state.filters).then(sumChartData => this.setState({ sumChartData }));
    }

    onVendorChange = (vendorId: string) => {
        api.vendor.getPois(vendorId)
            .then(vendorPois => this.setState({ vendorPois }));
    }

    toExpenseBinding = (e: Expense): ExpenseBinding => {
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
            installmentRef: e.installmentRef,
            paymentTypeId: e.paymentType.id,
            poiId: e.poi ? e.poi.id : undefined,
            vendorId: e.vendor ? e.vendor.id : undefined,
        };
    }

    uploadFile = (file: File) => {
        return api.file.post(file);
    }
}

export default ExpensesPage;
