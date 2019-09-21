import React from 'react';
import { ControlLabel, FormControl } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

import { TripBinding } from 'types/trips';

type Props = {
  onChange: (changedValue: Partial<TripBinding>) => void,
}

const TripForm = ({ onChange }: Props) => {
  return (
    <div>
      <ControlLabel>Name</ControlLabel>
      <FormControl type="text" onChange={x => onChange({ name: x.target.value })} />
      <ControlLabel>Start</ControlLabel>
      <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => onChange({ timestampStart: x.format("YYYY-MM-DD hh:mm") })} />
      <ControlLabel>End</ControlLabel>
      <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => onChange({ timestampEnd: x.format("YYYY-MM-DD hh:mm") })} />
    </div>
  );
};

export default TripForm;