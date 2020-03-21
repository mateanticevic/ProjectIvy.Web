import moment from 'moment';
import React from 'react';
import { FormLabel, FormGroup, InputGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';

interface Props {
    label: string;
    value?: any;
    onChange: (date: string) => void;
}

const DateFormElement = ({ label, onChange, value }: Props) => {
    return (<FormGroup>
        <FormLabel>
            {label}
        </FormLabel>
        <InputGroup>
            <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                locale={moment.locale('us')}
                onChange={x => onChange(x.format('YYYY-MM-DD'))}
                value={value}
            />
            <InputGroup.Append>
                {/* <Glyphicon glyph="calendar" /> */}
            </InputGroup.Append>
        </InputGroup>
    </FormGroup>);
};

export default DateFormElement;
