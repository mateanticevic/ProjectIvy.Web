import React from 'react';
import { FormLabel, FormControl } from 'react-bootstrap';
import { DatetimeInput } from 'components';
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
            <DatetimeInput timeFormat="HH:mm" onChange={timestampStart => onChange({ timestampStart })} />
            <FormLabel>End</FormLabel>
            <DatetimeInput timeFormat="HH:mm" onChange={timestampEnd => onChange({ timestampEnd })} />
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
