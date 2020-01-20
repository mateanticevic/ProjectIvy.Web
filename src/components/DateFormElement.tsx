import moment from 'moment';
import enGb from 'moment/locale/en-gb';
import React from 'react';
import { ControlLabel, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

interface Props {
    label: string;
    onChange: (date: string) => void;
    value?: any;
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
