import React from 'react';
import { FormLabel, FormControl } from 'react-bootstrap';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import { TripBinding } from 'types/trips';

interface Props {
  loadCities: any;
  onChange: (changedValue: Partial<TripBinding>) => void;
}

const TripForm = ({ loadCities, onChange }: Props) => {
    return (
        <div>
            <FormLabel>Name</FormLabel>
            <FormControl type="text" onChange={(x) => onChange({ name: x.target.value })} />
            <FormLabel>Start</FormLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm" onChange={x => onChange({ timestampStart: x.format('YYYY-MM-DD HH:mm') })} />
            <FormLabel>End</FormLabel>
            <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm" onChange={x => onChange({ timestampEnd: x.format('YYYY-MM-DD HH:mm') })} />
            <FormLabel>Cities</FormLabel>
            <AsyncSelect
                loadOptions={loadCities}
                isMulti
                onChange={cities => onChange({ cityIds: cities.map((x) => x.value) })}
                defaultOptions
            />
        </div>
    );
};

export default TripForm;
