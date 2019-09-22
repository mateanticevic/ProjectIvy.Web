import React from 'react';
import { ControlLabel, FormControl } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import { TripBinding } from 'types/trips';

type Props = {
  loadCities: any,
  onChange: (changedValue: Partial<TripBinding>) => void,
}

const TripForm = ({ loadCities, onChange }: Props) => {
  return (
    <div>
      <ControlLabel>Name</ControlLabel>
      <FormControl type="text" onChange={x => onChange({ name: x.target.value })} />
      <ControlLabel>Start</ControlLabel>
      <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => onChange({ timestampStart: x.format("YYYY-MM-DD hh:mm") })} />
      <ControlLabel>End</ControlLabel>
      <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => onChange({ timestampEnd: x.format("YYYY-MM-DD hh:mm") })} />
      <ControlLabel>Cities</ControlLabel>
      <AsyncSelect
        loadOptions={loadCities}
        isMulti
        onChange={cities => onChange({ cityIds: cities.map(x => x.value) })}
        defaultOptions
      />
    </div>
  );
};

export default TripForm;