import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import api from 'api/main';
import { DateFormElement } from 'components';
import { UserContext } from 'contexts/user-context';
import { KeyValuePair } from 'types/grouping';

interface MonthlyTotals {
    month: string;
    expenses: number;
    incomes: number;
}

const totalsByMonth = (totals: KeyValuePair<number>[]) => new Map(
    totals.map(total => [moment(total.key).format('YYYY-MM'), total.value])
);

export default function NetWorthPage() {
    const { defaultCurrency } = useContext(UserContext);
    const [from, setFrom] = useState(() => moment().startOf('year').format('YYYY-MM-DD'));
    const [to, setTo] = useState(() => moment().endOf('year').format('YYYY-MM-DD'));
    const isValidRange = moment(from, 'YYYY-MM-DD', true).isValid()
        && moment(to, 'YYYY-MM-DD', true).isValid()
        && moment(from).isSameOrBefore(moment(to), 'day');
    const [data, setData] = useState<MonthlyTotals[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (!isValidRange) {
            return;
        }

        let active = true;
        const filters = {
            from,
            to,
            targetCurrencyId: defaultCurrency?.id,
            page: 1,
            pageSize: 10,
        };

        setIsLoading(true);
        setError(false);

        Promise.all([
            api.expense.getSumByMonthOfYear(filters),
            api.income.getSumByMonthOfYear(filters),
        ]).then(([expenses, incomes]: [KeyValuePair<number>[], KeyValuePair<number>[]]) => {
            if (!active) {
                return;
            }

            const expenseTotals = totalsByMonth(expenses);
            const incomeTotals = totalsByMonth(incomes);
            const firstMonth = moment(from).startOf('month');
            const monthCount = moment(to).startOf('month').diff(firstMonth, 'months') + 1;
            setData(Array.from({ length: monthCount }, (_, month) => {
                const date = firstMonth.clone().add(month, 'months');
                const key = date.format('YYYY-MM');
                return {
                    month: date.format('MMM YYYY'),
                    expenses: expenseTotals.get(key) ?? 0,
                    incomes: incomeTotals.get(key) ?? 0,
                };
            }));
        }).catch(() => {
            if (active) {
                setError(true);
            }
        }).finally(() => {
            if (active) {
                setIsLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [from, to, isValidRange, defaultCurrency?.id, retry]);

    const formatAmount = (value: number) => `${value.toLocaleString('hr-HR', { maximumFractionDigits: 2 })}${defaultCurrency?.code ? ` ${defaultCurrency.code}` : ''}`;

    return (
        <Container>
            <Row className="g-3">
                <Col lg={3}>
                    <Card>
                        <Card.Header>Filters</Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                <DateFormElement label="From" value={from} onChange={setFrom} />
                                <DateFormElement label="To" value={to} onChange={setTo} />
                                {!isValidRange && (
                                    <Alert variant="warning" className="mb-0">Enter valid dates with From on or before To.</Alert>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={9}>
                    <Card>
                        <Card.Header>Expenses vs incomes</Card.Header>
                        <Card.Body>
                            {!isValidRange ? (
                                <p className="text-body-secondary mb-0">Select a valid date range to view monthly totals.</p>
                            ) : isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 420 }}>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading monthly totals...</span>
                                    </Spinner>
                                </div>
                            ) : error ? (
                                <Alert variant="danger">
                                    Could not load monthly totals.
                                    <Button variant="outline-danger" size="sm" className="ms-3" onClick={() => setRetry(value => value + 1)}>Retry</Button>
                                </Alert>
                            ) : (
                                <>
                                    {data.every(month => month.expenses === 0 && month.incomes === 0) && (
                                        <p className="text-body-secondary">No expenses or incomes for this period.</p>
                                    )}
                                    <ResponsiveContainer width="100%" height={420}>
                                        <BarChart data={data} margin={{ top: 16, right: 8, bottom: 8, left: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bs-border-color)" />
                                            <XAxis dataKey="month" stroke="var(--bs-secondary-color)" minTickGap={8} />
                                            <YAxis width={80} stroke="var(--bs-secondary-color)" tickFormatter={value => value.toLocaleString('hr-HR')} />
                                            <Tooltip
                                                formatter={value => formatAmount(Number(value))}
                                                contentStyle={{ backgroundColor: 'var(--bs-body-bg)', borderColor: 'var(--bs-border-color)', color: 'var(--bs-body-color)' }}
                                                cursor={{ fill: 'var(--bs-tertiary-bg)' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="expenses" name="Expenses" fill="var(--bs-danger)" />
                                            <Bar dataKey="incomes" name="Incomes" fill="var(--bs-success)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
