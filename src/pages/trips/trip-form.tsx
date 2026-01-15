import React from 'react';
import { FormLabel, FormControl } from 'react-bootstrap';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import { cityLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type TripBinding = components['schemas']['TripBinding'];

interface Props {
  onChange: (changedValue: Partial<TripBinding>) => void;
}

const TripForm = ({ onChange }: Props) => {
    const reactSelectStyles = useReactSelectStyles();
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
                loadOptions={cityLoader}
                isMulti
                onChange={cities => onChange({ cityIds: cities.map(x => x.value) })}
                defaultOptions
                styles={reactSelectStyles}
            />
        </div>
    );
};

export default TripForm;
