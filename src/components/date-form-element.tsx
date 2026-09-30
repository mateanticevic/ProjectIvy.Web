import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormLabel, FormGroup, InputGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { FaCalendar } from 'react-icons/fa';

interface Props {
    label?: string;
    value?: string | Date | moment.Moment;
    onChange: (date: string) => void;
}

const dateFormat = 'YYYY-MM-DD';

const committedValue = (value?: string | Date | moment.Moment) => {
    if (value == null || value === '') {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(dateFormat) : '';
};

const DateFormElement = ({ label, onChange, value }: Props) => {
    const [draft, setDraft] = useState<string | null>(null);
    const committed = committedValue(value);

    useEffect(() => {
        setDraft(null);
    }, [committed]);

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
        <FormGroup>
            {label &&
                <FormLabel>
                    {label}
                </FormLabel>
            }
            <InputGroup>
                <Datetime
                    dateFormat={dateFormat}
                    timeFormat={false}
                    locale={moment.locale('hr')}
                    onChange={handleChange}
                    value={value}
                    inputProps={{
                        className: 'form-control',
                        ...(draft !== null ? { value: draft } : {}),
                    }}
                />
                <InputGroup.Text>
                    <FaCalendar />
                </InputGroup.Text>
            </InputGroup>
        </FormGroup>
    );
};

export default DateFormElement;
