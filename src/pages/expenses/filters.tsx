import AsyncSelect from 'react-select/async';
import Datetime from 'react-datetime';
import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import { Col, FormLabel, FormGroup } from 'react-bootstrap';

import { ExpenseFilters } from 'types/expenses';
import { SelectOption } from 'types/common';
import { vendorLoader } from 'utils/select-loaders';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

interface Props {
    currencies: SelectOption[];
    filters: ExpenseFilters;
    types: SelectOption[];
    onChange: (expenseFilters: Partial<ExpenseFilters>) => void;
}

const dateFormat = 'YYYY-MM-DD';

const DateInput = ({ value, onChange }: { value?: string; onChange: (date: string) => void }) => {
    const [draft, setDraft] = useState<string | null>(null);

    useEffect(() => {
        setDraft(null);
    }, [value]);

    const handleChange = (next: string | moment.Moment) => {
        if (typeof next === 'string') {
            if (next === '') {
                setDraft(null);
                onChange('');
                return;
            }

            const parsed = moment(next, dateFormat, true);
            if (!parsed.isValid()) {
                setDraft(next);
                return;
            }

            setDraft(null);
            onChange(parsed.format(dateFormat));
            return;
        }

        if (!moment.isMoment(next) || !next.isValid()) {
            return;
        }

        setDraft(null);
        onChange(next.format(dateFormat));
    };

    return (
        <Datetime
            dateFormat={dateFormat}
            timeFormat={false}
            onChange={handleChange}
            value={value}
            inputProps={draft !== null ? { value: draft } : undefined}
        />
    );
};

const Filters = ({ currencies, filters, onChange, types }: Props) => {
    const reactSelectStyles = useReactSelectStyles();

    return (
        <div>
            <Row>
                <Col xs={6}>
                    <FormGroup>
                        <FormLabel>From</FormLabel>
                        <DateInput
                            value={filters.from}
                            onChange={from => onChange({ from })}
                        />
                    </FormGroup>
                </Col>
                <Col xs={6}>
                    <FormGroup>
                        <FormLabel>To</FormLabel>
                        <DateInput
                            value={filters.to}
                            onChange={to => onChange({ to })}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <FormGroup>
                        <FormLabel>Currency</FormLabel>
                        <ReactSelect
                            isMulti
                            options={currencies.map(x => ({ value: x.id, label: x.name }))}
                            onChange={currencies => onChange({ currencyId: currencies ? currencies.map(x => x.value) : [] })}
                            styles={reactSelectStyles}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Vendor</FormLabel>
                        <AsyncSelect
                            loadOptions={vendorLoader}
                            isMulti
                            onChange={vendors => onChange({ vendorId: vendors ? vendors.map(x => x.value) : [] })}
                            defaultOptions
                            styles={reactSelectStyles}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Type</FormLabel>
                        <ReactSelect
                            isMulti
                            options={types.map(x => ({ value: x.id, label: x.name, isDisabled: !!x.disabled }))}
                            onChange={types => onChange({ typeId: types ? types.map(x => x.value) : [] })}
                            styles={reactSelectStyles}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </div>
    );
};

export default Filters;
