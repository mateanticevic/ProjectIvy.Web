import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Col, Container, Card, Row, Accordion, Button, Modal, Form } from 'react-bootstrap';

import DayExpenses from './day-expenses';
import ExpenseLinkModal from './expense-link-modal';
import ExpenseModal from './expense-modal';
import Filters from './filters';
import FiltersMore from './filters-more';
import NumbersCard from './numbers-card';
import api from 'api/main';
import { ExpenseFilters } from 'types/expenses';
import { DistributionCard } from 'components';
import { GroupByTime } from 'consts/groupings';
import { Page } from 'pages/page';
import { PagedList, SelectOption } from 'types/common';
import { UserContext } from 'contexts/user-context';
import { components } from 'types/ivy-types';
import DropzoneButton from 'components/dropzone-button';

type ApiCard = components['schemas']['Card'];
type Expense = components['schemas']['Expense'];
type FileType = components['schemas']['FileType'];
type PaymentType = components['schemas']['PaymentType'];
type User = components['schemas']['User'];

interface Props {
    toast: (title: string, message: string) => void;
}

interface State {
    cards: SelectOption[];
    currencies: SelectOption[];
    descriptionSuggestions: string[];
    expense?: Expense;
    expenses: PagedList<Expense>;
    expensesAreLoading: boolean;
    fileTypes: FileType[];
    files: any[];
    filters: ExpenseFilters;
    graphs: any;
    isLinkModalOpen: boolean;
    isModalOpen: boolean;
    isSavingExpense: boolean;
    isSumModalOpen: boolean;
    layoutMode: LayoutMode;
    orderBy: any;
    paymentTypes: PaymentType[];
    selectedExpenseId?: string;
    selectedTripId?: string;
    stats: any;
    sumByCurrency: any;
    sumByType: boolean;
    sumChartData?: any;
    sumGroupBy: GroupByTime;
    sumGroupByBaseType: boolean;
    sumGroupByType: boolean;
    types: SelectOption[];
    vendorPois: any;
}

const sumByOptions = [
    { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
    { value: GroupByTime.ByMonth, name: 'Month' },
    { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
    { value: GroupByTime.ByYear, name: 'Year' },
];

const groupyByApis = {
    [GroupByTime.ByYear]: api.expense.getSumByYear,
    [GroupByTime.ByDayOfWeek]: api.expense.getSumByDayOfWeek,
    [GroupByTime.ByMonthOfYear]: api.expense.getSumByMonthOfYear,
    [GroupByTime.ByMonth]: api.expense.getSumByMonth,
};

const groupyByTypeApis = {
    [GroupByTime.ByYear]: api.expense.getSumByYearByType,
    [GroupByTime.ByMonthOfYear]: api.expense.getSumByMonthOfYearByType,
};

class ExpensesPage extends Page<Props, State> {

    user = this.context as User;
    state: State = {
        cards: [],
        currencies: [],
        descriptionSuggestions: [],
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
        isSumModalOpen: false,
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
        sumByCurrency: [],
        sumByType: true,
        sumGroupBy: GroupByTime.ByMonthOfYear,
        sumGroupByBaseType: true,
        sumGroupByType: false,
        types: [],
        vendorPois: [],
    };

    componentDidMount() {
        this.onFiltersChanged();
        api.card.get().then((cards: ApiCard[]) => this.setState({ cards: this.buildCardOptions(cards) }));
        api.common.getExpenseFileTypes().then(fileTypes => this.setState({ fileTypes }));
        api.common.getPaymentTypes().then(paymentTypes => this.setState({ paymentTypes }));
        api.currency.get().then(currencies => this.setState({ currencies }));
        api.expenseType.get({ orderBy: 'top10' }).then(types => {
            const optionZero = {
                id: 'TopTypes',
                name: 'Top 10 types',
                disabled: true,
            };
            types.splice(0, 0, optionZero);

            const optionTen = {
                id: 'OtherTypes',
                name: 'Other types',
                disabled: true,
            };
            types.splice(11, 0, optionTen);
            this.setState({ types });
        });
    }

    render() {
        const { expenses, filters, isSumModalOpen, sumByCurrency } = this.state;
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
                                            types={this.state.types}
                                            filters={this.state.filters}
                                            onChange={this.onFiltersChanged}
                                        />
                                    </Card.Body>
                                </Card>
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
                                <div className="form-grid">
                                    <Button
                                        size="sm"
                                        onClick={this.onExpenseNew}>
                                        New
                                    </Button>
                                    <DropzoneButton
                                        title="Create from photo"
                                        onSelected={this.onPhotosSelected}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={6}>
                        <InfiniteScroll
                            dataLength={expenses.items.length}
                            next={this.getNextPage}
                            hasMore={filters.page * filters.pageSize < expenses.count}
                            loader={<h4>Loading...</h4>}
                        >
                            {days.map((day, index) =>
                                <DayExpenses
                                    key={day}
                                    day={day}
                                    expenses={expensesByDay[day]}
                                    nestedComponent={index === 0 ? () => <Button /> : null}
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
                            stacked={this.state.sumGroupByType}
                            unit={this.user.defaultCurrency.symbol}
                            onClick={() => this.setState({ isSumModalOpen: true })}
                            onGroupByChange={this.onSumGroupBy}
                        />
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Group by type"
                                checked={this.state.sumGroupByType}
                                onChange={() => this.onSumGroupBy(undefined, !this.state.sumGroupByType)}
                            />
                            <Form.Check
                                disabled={!this.state.sumGroupByType}
                                type="checkbox"
                                label="By base type"
                                checked={this.state.sumGroupByBaseType}
                                onChange={() => this.setState({ sumGroupByBaseType: !this.state.sumGroupByBaseType }, this.onSumGroupBy)}
                            />
                        </Form.Group>
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
                {this.state.expense &&
                    <ExpenseModal
                        currencies={this.state.currencies}
                        descriptionSuggestions={this.state.descriptionSuggestions}
                        types={this.state.types}
                        vendorPois={this.state.vendorPois}
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
                }
                <Modal
                    size="xl"
                    show={isSumModalOpen}
                    onHide={() => this.setState({ isSumModalOpen: false })}
                >
                    <Modal.Header>Sum by</Modal.Header>
                    <Modal.Body>
                        <DistributionCard
                            dontRenderCard
                            data={this.state.sumChartData}
                            name="Sum"
                            stacked={true}
                            unit={this.user.defaultCurrency.symbol}
                            countByOptions={sumByOptions}
                            onGroupByChange={this.onSumGroupBy}
                        />
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private buildCardOptions = (cards: ApiCard[]): SelectOption[] => {
        const now = moment();
        const grouped = cards
            .filter(card => !!card?.id)
            .reduce((acc, card) => {
                const expiresOn = card.expires ? moment(card.expires) : undefined;
                const isExpired = expiresOn?.isValid() ? expiresOn.endOf('day').isBefore(now) : false;
                const option: SelectOption = {
                    id: card.id!,
                    name: this.getCardDisplayName(card),
                };
                (isExpired ? acc.inactive : acc.active).push(option);
                return acc;
            }, { active: [] as SelectOption[], inactive: [] as SelectOption[] });

        const options: SelectOption[] = [];

        if (grouped.active.length) {
            options.push({ id: '__activeCards__', name: 'Active cards', disabled: true });
            options.push(...grouped.active);
        }

        if (grouped.inactive.length) {
            options.push({ id: '__inactiveCards__', name: 'Inactive cards', disabled: true });
            options.push(...grouped.inactive);
        }

        return options;
    };

    private getCardDisplayName = (card: ApiCard): string => {
        const baseName = card.name ?? 'Card';
        return card.lastFourDigits ? `${baseName} ****${card.lastFourDigits}` : baseName;
    };

    deleteFile = (fileId) => {
        api.file.deleteFile(fileId);
    };

    getNextPage = () => {
        this.onFiltersChanged({
            page: this.state.filters.page + 1,
        });
    };

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
            currency: this.user.defaultCurrency,
            date: moment().format('YYYY-MM-DD'),
            expenseType: this.state.types[1],
            paymentType: this.state.paymentTypes[0],
        };
    };

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
    };

    onExpenseLinkClick = (expenseId: string) => {
        this.setState({
            isLinkModalOpen: true,
            selectedExpenseId: expenseId,
        });
    };

    onExpenseEdit = (expense: Expense) => {
        this.setState({
            expense: {
                ...expense,
                date: moment(expense.date).format('YYYY-MM-DD'),
                datePaid: moment(expense.datePaid).format('YYYY-MM-DD'),
            },
            files: expense.files,
            isModalOpen: true,
        });
    };

    onExpenseNew = () => {
        this.setState({
            expense: this.newExpense(),
            isModalOpen: true,
        });
    };

    onExpenseSave = (closeModal: boolean) => {
        this.setState({ isSavingExpense: true });

        const saveMethod = this.state.expense.id ? api.expense.put : api.expense.post;

        saveMethod(this.toExpenseBinding(this.state.expense))
            .then(() => {
                this.setState({ isModalOpen: !closeModal, isSavingExpense: false });
                this.onFiltersChanged();
            })
            .catch(() => this.setState({ isSavingExpense: false }));
    };

    onFiltersChanged = (changedFilters?: Partial<ExpenseFilters>, silent = false) => {
        let filters = this.resolveFilters(this.state.filters, changedFilters);

        const state = { ...filters };
        delete state.page;
        delete state.pageSize;

        const pageChanged = !!changedFilters?.page;
        if (!pageChanged) {
            filters = {
                ...filters,
                page: 1,
            };
        }

        this.setState({
            expensesAreLoading: !silent,
            filters,
        }, () => {
            if (!pageChanged) {
                this.onSumGroupBy(this.state.sumGroupBy);
            }
        });

        this.pushHistoryState(state);

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
    };

    onSumGroupBy = (groupBy?: GroupByTime, groupByType?: boolean) => {
        const sumGroupByType = groupByType === undefined ? this.state.sumGroupByType : groupByType;
        this.setState({
            sumGroupBy: groupBy ?? this.state.sumGroupBy,
            sumGroupByType,
        });

        this.setState({ sumChartData: undefined });

        if (sumGroupByType) {
            groupyByTypeApis[groupBy ?? this.state.sumGroupBy]({
                ...this.state.filters,
                byBaseType: this.state.sumGroupByBaseType,
            })
                .then(sumChartData => this.setState({ sumChartData: this.transformToChartData(sumChartData) }));
        }
        else {
            groupyByApis[groupBy ?? this.state.sumGroupBy](this.state.filters).then(sumChartData => this.setState({ sumChartData }));
        }
    };

    onPhotosSelected = (files: File[]) => {
        api.expense.postExpenseFromFile(files[0])
            .then(() => this.props.toast('Success', 'Expense created from photo'))
            .catch(response => this.props.toast('Failed', 'Expense template not recognized'));
    }

    transformToChartData = (data) => {
        return data.map(month => {
            return Object.assign({
                key: month.key
            },
                ...month.value.map(type => {
                    return {
                        [type.key]: type.value
                    };
                })
            );
        });
    };

    onVendorChange = (vendorId: string) => {
        api.vendor.getPois(vendorId)
            .then(vendorPois => this.setState({ vendorPois }));
    };

    toExpenseBinding = (e: Expense): ExpenseBinding => {
        return {
            amount: e.amount,
            cardId: e.card?.id,
            comment: e.comment,
            currencyId: e.currency.id,
            expenseTypeId: e.expenseType.id,
            date: e.date,
            datePaid: e.datePaid ?? e.date,
            timestamp: e.timestamp,
            parentAmount: e.parentAmount,
            parentCurrencyId: e.parentCurrency ? e.parentCurrency.id : undefined,
            parentCurrencyExchangeRate: e.parentCurrencyExchangeRate,
            modified: e.modified,
            id: e.id,
            installmentRef: e.installmentRef,
            paymentTypeId: e.paymentType?.id,
            poiId: e.poi?.id,
            vendorId: e.vendor?.id,
            vendorName: e.vendor?.id ? null : e.vendor?.name,
        };
    };

    uploadFile = (file: File) => {
        return api.file.post(file);
    };
}

ExpensesPage.contextType = UserContext;

export default ExpensesPage;
