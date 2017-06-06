import React from 'react';
import Moment from 'react-moment';

const TripRow = (props) => {
  return (
  <tr key={props.trip.id}>
      <td><Moment format="Do MMMM YYYY">{props.trip.timestampStart}</Moment></td>
      <td>{props.trip.name}</td>
      <td><Moment to={props.trip.timestampEnd} ago>{props.trip.timestampStart}</Moment></td>
  </tr>
  );
};

export default TripRow;
