import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import api from 'api/main';
import { Alert, Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { FaCalendar } from 'react-icons/fa';

import { DatetimeInput } from 'components';
import Select from 'components/select';
import { components } from 'types/ivy-types';

type Currency = components['schemas']['Currency'];
type IncomeBinding = components['schemas']['IncomeBinding'];
type IncomeSource = components['schemas']['IncomeSource'];
type IncomeType = components['schemas']['IncomeType'];
type Salary = components['schemas']['Salary'];

interface Props {
    currencies: Currency[];
    income: IncomeBinding;
    isOpen: boolean;
    isEditing: boolean;
    selectedSalary?: Salary;
    sources: IncomeSource[];
    types: IncomeType[];
    onClose(): void;
    onChange(changed: Partial<IncomeBinding>): void;
    onSave(): Promise<void>;
}

const IncomeModal = ({ onClose, onChange, onSave, currencies, income, isOpen, isEditing, selectedSalary, sources, types }: Props) => {

    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [salaryError, setSalaryError] = useState(false);
    const [salaryLoading, setSalaryLoading] = useState(false);
    const [retry, setRetry] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const pending = useRef(false);
    const salaryTo = income.date && moment(income.date).isValid()
        ? moment(income.date).add(5, 'days').format('YYYY-MM-DD')
        : undefined;

    useEffect(() => {
        if (!isOpen || !salaryTo) return;
        let ignore = false;
        setSalaries([]);
        setSalaryError(false);
        setSalaryLoading(true);
        api.salary.get({ To: salaryTo, Page: 1, PageSize: 5, OrderAscending: false })
            .then(result => { if (!ignore) setSalaries((result.items ?? []).slice(0, 5)); })
            .catch(() => { if (!ignore) setSalaryError(true); })
            .finally(() => { if (!ignore) setSalaryLoading(false); });
        return () => { ignore = true; };
    }, [isOpen, salaryTo, retry]);

    useEffect(() => {
        if (isOpen) setError('');
    }, [isOpen]);

    const save = async () => {
        if (pending.current) return;
        if (!income.date || !moment(income.date).isValid() || !Number.isFinite(income.amount)) {
            setError('Choose a valid date and amount.');
            return;
        }
        pending.current = true;
        setSaving(true);
        setError('');
        try {
            await onSave();
            onClose();
        } catch {
            setError('Could not save income. Your values have been kept. Please try again.');
        } finally {
            pending.current = false;
            setSaving(false);
        }
    };

    const salaryLabel = (salary: Salary) =>
        `${moment(salary.date).format('D MMM YYYY')} · ${salary.netTotal ?? 0} ${salary.currency?.code ?? ''}${salary.note ? ` · ${salary.note}` : ''}`;
    const currentSalary = salaries.find(salary => salary.id === income.salaryId)
        ?? (selectedSalary?.id === income.salaryId ? selectedSalary : undefined);

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={() => { if (!pending.current) onClose(); }}
            aria-labelledby="income-modal-title"
            size="sm"
        >
            <Modal.Header closeButton={!saving}>
                <Modal.Title id="income-modal-title">{isEditing ? 'Edit income' : 'New income'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <fieldset disabled={saving}>
                    <FormGroup controlId="income-date">
                        <FormLabel>Date</FormLabel>
                        <InputGroup>
                            <DatetimeInput inputProps={{ id: 'income-date', disabled: saving }} value={income.date} onChange={date => onChange({ date })} />
                            <InputGroup.Text>
                                <FaCalendar />
                            </InputGroup.Text>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup controlId="income-description">
                        <FormLabel>Description</FormLabel>
                        <FormControl
                            type="text"
                            value={income.description ?? ''}
                            onChange={x => onChange({ description: x.target.value })}
                        />
                    </FormGroup>
                    <FormGroup controlId="income-amount">
                        <FormLabel>Amount</FormLabel>
                        <InputGroup>
                            <FormControl
                                type="number"
                                value={income.amount ?? ''}
                                onChange={x => onChange({ amount: Number.parseFloat(x.target.value) })}
                            />
                            <InputGroup.Text>{income.currencyId}</InputGroup.Text>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup controlId="income-currency">
                        <FormLabel>Currency</FormLabel>
                        <Select options={currencies} selected={income.currencyId ?? ''} defaultOptionId="" onChange={currencyId => onChange({ currencyId })} />
                    </FormGroup>
                    <FormGroup controlId="income-source">
                        <FormLabel>Source</FormLabel>
                        <Select options={sources} selected={income.sourceId ?? ''} defaultOptionId="" onChange={sourceId => onChange({ sourceId })} />
                    </FormGroup>
                    <FormGroup controlId="income-type">
                        <FormLabel>Type</FormLabel>
                        <Select options={types} selected={income.typeId ?? ''} defaultOptionId="" onChange={typeId => onChange({ typeId })} />
                    </FormGroup>
                    <FormGroup controlId="income-salary">
                        <FormLabel>Salary</FormLabel>
                        <FormControl
                            as="select"
                            value={income.salaryId ?? ''}
                            disabled={salaryLoading || !salaryTo}
                            onChange={event => onChange({ salaryId: event.target.value || null })}
                        >
                            <option value="">None</option>
                            {income.salaryId && !salaries.some(salary => salary.id === income.salaryId) &&
                                <option value={income.salaryId}>{currentSalary ? salaryLabel(currentSalary) : 'Selected salary'}</option>
                            }
                            {salaries.map(salary => <option key={salary.id} value={salary.id ?? ''}>{salaryLabel(salary)}</option>)}
                        </FormControl>
                        {salaryLoading && <div role="status">Loading salaries...</div>}
                        {salaryError && <Alert variant="danger">Could not load salaries. <Button size="sm" onClick={() => setRetry(value => value + 1)}>Retry salaries</Button></Alert>}
                    </FormGroup>
                </fieldset>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" disabled={saving} onClick={save}>
                    <FontAwesome name="save" /> {saving ? 'Saving...' : 'Save'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IncomeModal;
