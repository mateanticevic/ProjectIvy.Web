import moment, { Moment } from 'moment';
import React from 'react';
import { FormLabel, FormGroup, InputGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { FaCalendar } from 'react-icons/fa';

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
                <Datetime
                    dateFormat="YYYY-MM-DD"
                    timeFormat={false}
                    locale={moment.locale('hr')}
                    onChange={x => onChange(x.format('YYYY-MM-DD'))}
                    value={value}
                />
                <InputGroup.Text>
                    <FaCalendar />
                </InputGroup.Text>
            </InputGroup>
        </FormGroup>
    );
};

export default DateFormElement;
