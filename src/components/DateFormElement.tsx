import moment from 'moment';
import React from 'react';
import { ControlLabel, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

interface Props {
    label: string;
    value?: any;
    onChange: (date: string) => void;
}

const DateFormElement = ({ label, onChange, value }: Props) => {
    return (<FormGroup>
        <ControlLabel>
            {label}
        </ControlLabel>
        <InputGroup>
            <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                locale={moment.locale('us')}
                onChange={x => onChange(x.format('YYYY-MM-DD'))}
                value={value}
            />
            <InputGroup.Addon>
                <Glyphicon glyph="calendar" />
            </InputGroup.Addon>
        </InputGroup>
    </FormGroup>);
};

export default DateFormElement;
