import React from 'react';
import { ControlLabel, FormControl } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

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

TripForm.propTypes = {
  onChange: React.PropTypes.func
};