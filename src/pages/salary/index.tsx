import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import api from 'api/main';
import { DatetimeInput } from 'components';
import { UserContext } from 'contexts/user-context';
import { components } from 'types/ivy-types';
import SalaryModal from './salary-modal';

type Salary = components['schemas']['Salary'];
type SalaryBinding = components['schemas']['SalaryBinding'];
type Company = components['schemas']['Company'];
type Currency = components['schemas']['Currency'];
interface Props { toast: (title: string, message: string) => void; }
const amountFormatter = new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 20 });
const validDate = (value: string | null) => value && moment(value, 'YYYY-MM-DD', true).isValid() ? value : '';

export default function SalaryPage({ toast }: Props) {
    const user = useContext(UserContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const from = validDate(searchParams.get('from'));
    const to = validDate(searchParams.get('to'));
    const companyId = searchParams.get('companyId') ?? '';
    const currencyId = searchParams.get('currencyId') ?? '';
    const rawPage = Number(searchParams.get('page') ?? 1);
    const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const [items, setItems] = useState<Salary[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currencyError, setCurrencyError] = useState(false);
    const [currencyRevision, setCurrencyRevision] = useState(0);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [companyError, setCompanyError] = useState(false);
    const [companyRevision, setCompanyRevision] = useState(0);
    const [modal, setModal] = useState<{ salary?: Salary }>();
    const [editingId, setEditingId] = useState<string>();
    const [detailError, setDetailError] = useState('');
    const editRequest = useRef(0);
    const [deleting, setDeleting] = useState<Salary>();
    const [deleteError, setDeleteError] = useState('');
    const [busy, setBusy] = useState(false);
    const mutationPending = useRef(false);
    const invalidRange = !!(from && to && from > to);

    useEffect(() => {
        let active = true;
        setCurrencyError(false);
        api.currency.get().then(response => { if (active) setCurrencies(response); })
            .catch(() => { if (active) setCurrencyError(true); });
        return () => { active = false; };
    }, [currencyRevision]);

    useEffect(() => {
        let active = true;
        setCompanyError(false);
        api.company.get({ PageAll: true }).then(response => { if (active) setCompanies((response.items ?? []).filter(company => !!company.id)); })
            .catch(() => { if (active) setCompanyError(true); });
        return () => { active = false; };
    }, [companyRevision]);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');
        if (invalidRange) {
            setLoading(false);
            return;
        }
        api.salary.get({
            Page: page, PageSize: 25, OrderAscending: false,
            ...(from ? { From: from } : {}), ...(to ? { To: to } : {}), ...(currencyId ? { CurrencyId: currencyId } : {}), ...(companyId ? { CompanyId: companyId } : {})
        }).then(response => {
            if (!active) return;
            setItems(response.items ?? []);
            setCount(response.count ?? 0);
        }).catch(() => { if (active) setError('Could not load salaries.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [from, to, currencyId, companyId, page, revision, invalidRange]);

    useEffect(() => () => { editRequest.current++; }, []);

    const updateQuery = (key: string, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        if (key !== 'page') next.delete('page');
        setSearchParams(next);
    };

    const edit = async (salary: Salary) => {
        if (!salary.id) return;
        const request = ++editRequest.current;
        setEditingId(salary.id);
        setDetailError('');
        try {
            const detail = await api.salary.getById(salary.id);
            if (request === editRequest.current) setModal({ salary: { ...detail, id: salary.id } });
        } catch {
            if (request === editRequest.current) setDetailError('Could not load salary details. Select Edit to try again.');
        } finally {
            if (request === editRequest.current) setEditingId(undefined);
        }
    };

    const save = async (binding: SalaryBinding) => {
        if (mutationPending.current) return;
        mutationPending.current = true;
        setBusy(true);
        try {
            if (modal?.salary?.id) await api.salary.put(modal.salary.id, binding);
            else await api.salary.post(binding);
            setModal(undefined);
            toast('Success', 'Salary saved.');
            setRevision(value => value + 1);
        } catch (error) {
            toast('Failed', 'Could not save salary.');
            throw error;
        } finally {
            mutationPending.current = false;
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!deleting?.id || mutationPending.current) return;
        mutationPending.current = true;
        setBusy(true);
        setDeleteError('');
        try {
            await api.salary.del(deleting.id);
            setDeleting(undefined);
            toast('Success', 'Salary deleted.');
            if (items.length === 1 && page > 1) updateQuery('page', String(page - 1));
            setRevision(value => value + 1);
        } catch {
            setDeleteError('Could not delete salary. Please try again.');
            toast('Failed', 'Could not delete salary.');
        } finally {
            mutationPending.current = false;
            setBusy(false);
        }
    };

    const actionsDisabled = busy || !!editingId || !currencies.length || currencyError || !companies.length || companyError;
    return (
        <Container>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h1>Salary</h1>
                <Button disabled={actionsDisabled} onClick={() => setModal({})}>Add salary</Button>
            </div>
            {currencyError && <Alert variant="danger">Could not load currencies. <Button variant="outline-danger" onClick={() => setCurrencyRevision(value => value + 1)}>Retry currencies</Button></Alert>}
            {companyError && <Alert variant="danger">Could not load companies. <Button variant="outline-danger" onClick={() => setCompanyRevision(value => value + 1)}>Retry companies</Button></Alert>}
            <Row className="g-3 mb-3">
                <Col sm={6} lg={3}><Form.Group controlId="salary-from"><Form.Label>From</Form.Label><DatetimeInput inputProps={{ id: 'salary-from' }} value={from} onChange={value => updateQuery('from', value)} /></Form.Group></Col>
                <Col sm={6} lg={3}><Form.Group controlId="salary-to"><Form.Label>To</Form.Label><DatetimeInput inputProps={{ id: 'salary-to' }} value={to} onChange={value => updateQuery('to', value)} /></Form.Group></Col>
                <Col sm={6} lg={3}>
                    <Form.Group controlId="salary-currency-filter">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select value={currencyId} onChange={event => updateQuery('currencyId', event.target.value)}>
                            <option value="">All currencies</option>
                            {currencies.map(currency => <option key={currency.id} value={currency.id!}>{currency.code}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6} lg={3}>
                    <Form.Group controlId="salary-company-filter">
                        <Form.Label>Company</Form.Label>
                        <Form.Select value={companyId} onChange={event => updateQuery('companyId', event.target.value)}>
                            <option value="">All companies</option>
                            {companies.map(company => <option key={company.id} value={company.id!}>{company.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            {detailError && <Alert variant="danger">{detailError}</Alert>}
            {invalidRange ? <Alert variant="warning">From must be on or before To.</Alert> : loading ? (
                <div role="status"><Spinner size="sm" /> Loading salaries...</div>
            ) : error ? (
                <Alert variant="danger">{error} <Button variant="outline-danger" onClick={() => setRevision(value => value + 1)}>Retry salaries</Button></Alert>
            ) : (
                <>
                    {items.length === 0 ? <p>No salaries found.</p> : (
                        <Table responsive striped hover aria-label="Salaries">
                            <thead><tr><th>Date</th><th>Currency</th><th className="text-end">Gross</th><th className="text-end text-nowrap">Gross total</th><th className="text-end">Net</th><th className="text-end text-nowrap">Net total</th><th>Actions</th></tr></thead>
                            <tbody>
                                {items.map(salary => (
                                    <tr key={salary.id}>
                                        <td className="text-nowrap">{moment(salary.date).format('D MMM YYYY')}</td>
                                        <td>{salary.currency?.code}</td>
                                        <td className="text-end">{amountFormatter.format(salary.gross ?? 0)}</td>
                                        <td className="text-end">{amountFormatter.format(salary.grossTotal ?? 0)}</td>
                                        <td className="text-end">{amountFormatter.format(salary.net ?? 0)}</td>
                                        <td className="text-end">{amountFormatter.format(salary.netTotal ?? 0)}</td>
                                        <td><div className="d-flex gap-2">
                                            <Button size="sm" disabled={actionsDisabled || !salary.id} onClick={() => edit(salary)}>{editingId === salary.id ? 'Loading...' : 'Edit'}</Button>
                                            <Button size="sm" variant="outline-danger" disabled={busy || !!editingId || !salary.id} onClick={() => { setDeleteError(''); setDeleting(salary); }}>Delete</Button>
                                        </div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <span>Page {page} of {Math.max(1, Math.ceil(count / 25))} · {count} salaries</span>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" disabled={page <= 1 || busy} onClick={() => updateQuery('page', String(page - 1))}>Previous</Button>
                            <Button variant="outline-primary" disabled={page * 25 >= count || busy} onClick={() => updateQuery('page', String(page + 1))}>Next</Button>
                        </div>
                    </div>
                </>
            )}
            {modal && <SalaryModal salary={modal.salary} currencies={currencies} companies={companies} defaultCurrencyId={user.defaultCurrency?.id} onClose={() => setModal(undefined)} onSave={save} />}
            <Modal show={!!deleting} onHide={() => { if (!mutationPending.current) setDeleting(undefined); }} backdrop="static" aria-labelledby="salary-delete-title">
                <Modal.Header closeButton={!busy}><Modal.Title id="salary-delete-title">Delete salary</Modal.Title></Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    Delete salary dated {deleting?.date ? moment(deleting.date).format('D MMM YYYY') : 'unknown'} with net total {deleting?.netTotal ?? 0} {deleting?.currency?.code}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={busy} onClick={() => setDeleting(undefined)}>Cancel</Button>
                    <Button variant="danger" disabled={busy} onClick={remove}>{busy ? 'Deleting...' : 'Delete salary'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
