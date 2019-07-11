import React from 'react';
import PropTypes from 'prop-types';
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
  onChange: PropTypes.func
};