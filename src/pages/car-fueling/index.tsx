import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Alert, Button, Card, Col, Container, Row, Spinner, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import api from 'api/main';
import { CarFueling, CarFuelTotal } from 'types/car-fueling';
import { components } from 'types/ivy-types';
import FuelingModal from './fueling-modal';

interface FuelingData {
    car: components['schemas']['Car'];
    history: CarFueling[];
    yearly: CarFuelTotal[];
    monthly: CarFuelTotal[];
}

const formatLiters = (value: number) => `${value.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;

interface Props {
    toast: (title: string, message: string) => void;
}

export default function CarFuelingPage({ toast }: Props) {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<FuelingData>();
    const [grouping, setGrouping] = useState<'year' | 'month'>('year');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        setError(false);
        if (!id) {
            setError(true);
            setIsLoading(false);
            return;
        }
        Promise.all([
            api.car.get(id), api.car.getFuelings(id),
            api.car.getFuelSumByYear(id), api.car.getFuelSumByMonth(id),
        ]).then(([car, history, yearly, monthly]) => {
            if (active) {
                setData({
                    car,
                    history: [...(history ?? [])].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()),
                    yearly: yearly ?? [],
                    monthly: monthly ?? [],
                });
            }
        }).catch(() => {
            if (active) {
                setError(true);
                toast('Failed', 'Could not load fueling data. Please try again.');
            }
        }).finally(() => {
            if (active) setIsLoading(false);
        });
        return () => { active = false; };
    }, [id, refresh, toast]);

    const summary = [...(grouping === 'year' ? data?.yearly ?? [] : data?.monthly ?? [])]
        .sort((a, b) => a.key - b.key)
        .map(item => ({ key: grouping === 'year' ? String(item.key) : moment().month(item.key - 1).format('MMMM'), value: item.value }));
    const total = (data?.yearly ?? []).reduce((sum, item) => sum + item.value, 0);

    return (
        <Container>
            <Link to={`/car/${id}`} className="d-inline-block mb-2">Back to car</Link>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h1 className="fs-3 mb-1">Car Fueling</h1>
                    <p className="text-body-secondary mb-0">{data?.car.model?.name || 'Fueling history and volume'}</p>
                </div>
                <Button onClick={() => setShowModal(true)} disabled={isLoading || error || !data}>
                    <FaPlus aria-hidden="true" className="me-2" />Add fueling
                </Button>
            </div>
            {isLoading && <div className="d-flex align-items-center gap-2 py-4" role="status"><Spinner animation="border" size="sm" aria-hidden="true" />Loading fueling data…</div>}
            {!isLoading && error && <Alert variant="danger">Could not load fueling data. <Button variant="outline-danger" size="sm" onClick={() => setRefresh(value => value + 1)}>Retry</Button></Alert>}
            {!isLoading && !error && data && <>
                <Row>
                    <Col xs={6}>
                        <Card><Card.Body><div className="text-body-secondary">Total fuel</div><div className="fs-3 fw-semibold">{formatLiters(total)}</div></Card.Body></Card>
                    </Col>
                    <Col xs={6}>
                        <Card><Card.Body><div className="text-body-secondary">Fuelings</div><div className="fs-3 fw-semibold">{data.history.length}</div></Card.Body></Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={5}>
                        <Card>
                            <Card.Header as="h2" className="fs-5">Fuel volume by {grouping}</Card.Header>
                            <Card.Body>
                                <ToggleButtonGroup type="radio" name="fueling-grouping" value={grouping} onChange={setGrouping} className="mb-3">
                                    <ToggleButton id="fueling-year" value="year" variant={grouping === 'year' ? 'primary' : 'outline-secondary'}>Yearly</ToggleButton>
                                    <ToggleButton id="fueling-month" value="month" variant={grouping === 'month' ? 'primary' : 'outline-secondary'}>Monthly</ToggleButton>
                                </ToggleButtonGroup>
                                {grouping === 'month' && <p className="small text-body-secondary">Totals for each calendar month across all years.</p>}
                                {summary.length === 0 ? <p className="text-body-secondary mb-0">No fueling totals yet.</p> : <>
                                    <ResponsiveContainer height={250}>
                                        <BarChart data={summary}>
                                            <XAxis dataKey="key" tick={{ fill: 'var(--bs-body-color)' }} />
                                            <YAxis width={85} tickFormatter={formatLiters} tick={{ fill: 'var(--bs-body-color)' }} />
                                            <Tooltip
                                                formatter={value => formatLiters(Number(value))}
                                                contentStyle={{ backgroundColor: 'var(--bs-body-bg)', borderColor: 'var(--bs-border-color)' }}
                                                labelStyle={{ color: 'var(--bs-body-color)' }}
                                                itemStyle={{ color: 'var(--bs-body-color)' }}
                                            />
                                            <Bar dataKey="value" name="Fuel volume" fill="var(--bs-primary)" isAnimationActive={false} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </>}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={7}>
                        <Card>
                            <Card.Header as="h2" className="fs-5">Fueling history</Card.Header>
                            <Card.Body>
                                {data.history.length === 0 ? <p className="text-body-secondary mb-0">No fuelings recorded yet. Add your first fueling to get started.</p> :
                                    <Table responsive hover className="mb-0" aria-label="Fueling history">
                                        <thead><tr><th>Date</th><th className="text-end">Fuel volume</th></tr></thead>
                                        <tbody>{data.history.map((fueling, index) => <tr key={`${fueling.date}-${index}`}><td>{moment(fueling.date).format('D MMM YYYY')}</td><td className="text-end text-nowrap">{formatLiters(fueling.amountInLiters)}</td></tr>)}</tbody>
                                    </Table>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>}
            {showModal && id && <FuelingModal carId={id} toast={toast} onClose={() => setShowModal(false)} onSaved={() => {
                setShowModal(false);
                toast('Success', 'Fueling added.');
                setRefresh(value => value + 1);
            }} />}
        </Container>
    );
}
