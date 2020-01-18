import moment from 'moment';
import React from 'react';
import { OverlayTrigger } from 'react-bootstrap/lib';
import Label from 'react-bootstrap/lib/Label';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Moment from 'react-moment';

const TripRow = (props) => {

  const yearTooltip = (
    <Tooltip id="tooltip">
      From <Moment format="Do MMMM YYYY">{props.trip.timestampStart}</Moment> to <Moment format="Do MMMM YYYY">{props.trip.timestampEnd}</Moment>.
    </Tooltip>
  );

  const countryFlags = props.trip.countries.map(function(country) {
    const countryClassName = 'flag-icon flag-icon-' + country.id.toLowerCase();
    return <span key={country.id} title={country.name}><span className={countryClassName}/>&nbsp;</span>;
  });

  return (
  <tr key={props.trip.id} className="cursor-pointer" onClick={() => window.location.assign(`/trips/${props.trip.id}`)}>
      <td>
        <OverlayTrigger placement="left" overlay={yearTooltip}>
          <Label bsStyle={moment(props.trip.timestampStart).isAfter(moment(), 'day') ? 'success' : 'primary'}><Moment format="YYYY">{props.trip.timestampStart}</Moment></Label>
        </OverlayTrigger>
      </td>
      <td>{props.trip.name}</td>
      <td>{countryFlags}</td>
  </tr>
  );
};

export default TripRow;
