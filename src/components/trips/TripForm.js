import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Datetime from 'react-datetime';
import Select from '../common/Select';

const TripForm = (props) => {
  return (
    <div>
        <ControlLabel>Name</ControlLabel>
        <FormControl type="text" onChange={x => props.onChange({comment: x.target.value})} />
        <ControlLabel>Start</ControlLabel>                
        <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => props.onChange({date: x.format("YYYY-MM-DD hh:mm")})} />  
        <ControlLabel>End</ControlLabel>                
        <Datetime dateFormat="YYYY-MM-DD" timeFormat="hh:mm" onChange={x => props.onChange({date: x.format("YYYY-MM-DD hh:mm")})} />  
    </div>
  );
};

export default TripForm;