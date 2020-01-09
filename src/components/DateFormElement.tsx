import React from 'react';
import Datetime from 'react-datetime';
import { FormGroup, ControlLabel, InputGroup, Glyphicon } from 'react-bootstrap/lib';

type Props = {
    label: string,
    onChange: (date: string) => void;
    value?: any,
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
                onChange={x => onChange(x.format('YYYY-MM-DD'))}
                value={value}
            />
            <InputGroup.Addon>
                <Glyphicon glyph="calendar" />
            </InputGroup.Addon>
        </InputGroup>
    </FormGroup>);
}

export default DateFormElement;