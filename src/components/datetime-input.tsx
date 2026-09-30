import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Datetime from 'react-datetime';

interface InputProps {
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    value?: string;
}

interface Props {
    dateFormat?: string;
    inputProps?: InputProps;
    locale?: string;
    timeFormat?: string | false;
    value?: string | Date | moment.Moment;
    onChange: (value: string) => void;
}

const defaultDateFormat = 'YYYY-MM-DD';

const outputFormat = (dateFormat: string, timeFormat?: string | false) =>
    timeFormat ? `${dateFormat} ${timeFormat}` : dateFormat;

const committedValue = (value: Props['value'], format: string) => {
    if (value == null || value === '') {
        return '';
    }

    if (typeof value === 'string') {
        if (moment(value, format, true).isValid()) {
            return value;
        }

        const parsed = moment(value);
        return parsed.isValid() ? parsed.format(format) : value;
    }

    const parsed = moment(value);
    return parsed.isValid() ? parsed.format(format) : '';
};

const DatetimeInput = ({
    dateFormat = defaultDateFormat,
    inputProps,
    locale,
    onChange,
    timeFormat = false,
    value,
}: Props) => {
    const format = outputFormat(dateFormat, timeFormat);
    const [draft, setDraft] = useState<string | null>(null);
    const committed = committedValue(value, format);

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

            const parsed = moment(next, format, true);
            if (!parsed.isValid()) {
                setDraft(next);
                return;
            }

            setDraft(null);
            onChange(parsed.format(format));
            return;
        }

        if (!moment.isMoment(next) || !next.isValid()) {
            return;
        }

        setDraft(null);
        onChange(next.format(format));
    };

    return (
        <Datetime
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            locale={locale}
            onChange={handleChange}
            value={committed}
            inputProps={{
                ...inputProps,
                ...(draft !== null ? { value: draft } : {}),
            }}
        />
    );
};

export default DatetimeInput;
