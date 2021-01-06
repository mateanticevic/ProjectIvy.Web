import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Container, Card, Row, Accordion, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

import { Currency, Expense, ExpenseBinding, ExpenseFilters, ExpenseFile } from 'types/expenses';
import api from '../../api/main';
import { GroupByTime } from '../../consts/groupings';
import { Page } from '../Page';
import { CountByChart } from './CountByChart';
import ExpenseModal from './ExpenseModal';
import ExpensePanel from './ExpensePanel';
import Filters from './Filters';
import FiltersMore from './FiltersMore';
import { DistributionCard } from '../../components/DistributionCard';
import { PagedList } from 'types/common';

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
    orderBy: any;
    paymentTypes: any[];
    stats: any;
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
}

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
        const chartSumData = _.reverse(_.map(this.state.graphs.sum, x => ({ value: x.data, key: moment(`${x.year}-${x.month}-1`).format('YYYY MMM') })));

        const countByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
            { value: GroupByTime.ByDay, name: 'Day' },
        ];

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
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            eventKey="0"
                                        >
                                            More filters
                                      </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                <FiltersMore
                                                    cards={this.state.cards}
                                                    paymentTypes={this.state.paymentTypes}
                                                    filters={this.state.filters}
                                                    order={this.state.order}
                                                    orderBy={this.state.orderBy}
                                                    onChange={this.onFiltersChanged}
                                                />
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
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
                                <DistributionCard
                                    countByOptions={sumByOptions}
                                    data={this.state.sumChartData}
                                    name="Sum"
                                    onGroupByChange={this.onSumGroupBy}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <Card.Header>
                                        By Type
                                  </Card.Header>
                                    <Card.Body>
                                        <CountByChart data={this.state.graphs.countByType} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card>
                                    <Card.Header>
                                        By Vendor
                                  </Card.Header>
                                    <Card.Body>
                                        <CountByChart data={this.state.graphs.countByVendor} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <Card>
                                    <Card.Header>
                                        By Currency
                                    </Card.Header>
                                    <Card.Body className="padding-0">
                                        <ListGroup>
                                            {this.state.sumByCurrency.map(item =>
                                                <ListGroupItem>
                                                    <Badge variant="primary">{item.key.id}</Badge>&nbsp;{item.key.name}
                                                    <span className="pull-right">{item.value}</span>
                                                </ListGroupItem>
                                            )}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
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
                    files={this.state.files}
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

    @boundMethod
    private deleteFile(fileId) {
        api.file.deleteFile(fileId);
    }

    @boundMethod
    private linkExpenseFile(expenseId: string, fileId: string, expenseFile: ExpenseFile) {
        api.expense
            .postFile(expenseId, fileId, expenseFile);
    }

    private newExpense(): Partial<Expense> {
        return {
            amount: 0,
            comment: '',
            currency: this.state.defaultCurrency,
            date: moment().format('YYYY-M-D'),
            expenseType: this.state.types[0],
            paymentType: this.state.paymentTypes[0],
        };
    }

    @boundMethod
    private onExpenseChanged(expenseValue: ExpenseBinding) {
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
                .then(descriptionSuggestions => this.setState({ descriptionSuggestions }))
        });

        if (expenseValue && expenseValue.vendorId) {
            this.onVendorChange(expenseValue.vendorId);
        }
    }

    @boundMethod
    private onExpenseEdit(expense: Expense) {
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
    private onExpenseNew() {
        this.setState({
            expense: this.newExpense(),
            isModalOpen: true,
        });
    }

    @boundMethod
    private onExpenseSave(closeModal: boolean) {
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
    private onFiltersChanged(changedFilters?: Partial<ExpenseFilters>) {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);
        this.setState({
            expensesAreLoading: true,
            filters,
        }, () => {
            this.onSumGroupBy(this.state.sumGroupBy);
        });

        api.expense
            .get(filters)
            .then(expenses => {
                this.setState({
                    expenses,
                    expensesAreLoading: false,
                });

                api.expense
                    .getCountByVendor(filters)
                    .then(data => {
                        const top = _.take(_.filter(data.items, item => item.key.id), 3);

                        const chartData = top.map(x => ({ name: x.key.name, value: x.value }));

                        chartData.push({
                            name: 'Other',
                            value: expenses.count - _.sum(top.map(x => x.value))
                        });

                        this.setState({
                            graphs: {
                                ...this.state.graphs,
                                countByVendor: chartData,
                            },
                        });
                    });
            });

        const pageAllFilters = {
            ...filters,
            pageAll: true,
        };

        api.expense
            .getCountByType(pageAllFilters)
            .then(data => {
                const top = _.take(_.filter(data.items, item => item.key), 3);
                const other = _.difference(data.items, top);

                const chartData = top.map(x => ({ name: x.key.name, value: x.value }));
                if (other.length > 0) {
                    chartData.push({ name: 'Other', value: _.sum(other.map(x => x.count)) });
                }

                this.setState({
                    graphs: {
                        ...this.state.graphs,
                        countByType: chartData,
                    },
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

    @boundMethod
    private onVendorChange(vendorId: string) {
        api.vendor.getPois(vendorId)
            .then(vendorPois => this.setState({ vendorPois }));
    }

    private toExpenseBinding(e: Expense): ExpenseBinding {
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

    private uploadFile(file: File) {
        return api.file.post(file);
    }
}

export default ExpensesPage;
