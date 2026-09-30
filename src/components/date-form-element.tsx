import moment from 'moment';
import React from 'react';
import { FormLabel, FormGroup, InputGroup } from 'react-bootstrap';
import { FaCalendar } from 'react-icons/fa';

import DatetimeInput from './datetime-input';

interface Props {
    label?: string;
    value?: string | Date | moment.Moment;
    onChange: (date: string) => void;
}

const DateFormElement = ({ label, onChange, value }: Props) => {
    return (
        <FormGroup>
            {label &&
                <FormLabel>
                    {label}
                </FormLabel>
            }
            <InputGroup>
                <DatetimeInput
                    inputProps={{ className: 'form-control' }}
                    locale={moment.locale('hr')}
                    value={value}
                    onChange={onChange}
                />
                <InputGroup.Text>
                    <FaCalendar />
                </InputGroup.Text>
            </InputGroup>
        </FormGroup>
    );
};

export default DateFormElement;
