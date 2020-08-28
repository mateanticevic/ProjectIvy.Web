import moment from 'moment';
import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';

const TripRow = (props) => {

  const yearTooltip = (
    <Tooltip id="tooltip">
      From {moment(props.trip.timestampStart).format('Do MMMM YYYY')} to {moment(props.trip.timestampEnd).format('Do MMMM YYYY')}
    </Tooltip>
  );

  const countryFlags = props.trip.countries.map(function (country) {
    const countryClassName = 'flag-icon flag-icon-' + country.id.toLowerCase();
    return <span key={country.id} title={country.name}><span className={countryClassName} />&nbsp;</span>;
  });

  return (
    <tr key={props.trip.id} className="cursor-pointer" onClick={() => window.location.assign(`/trips/${props.trip.id}`)}>
      <td>
        <OverlayTrigger placement="left" overlay={yearTooltip}>
          <Badge variant={moment(props.trip.timestampStart).isAfter(moment(), 'day') ? 'success' : 'primary'}>{moment(props.trip.timestampStart).format('YYYY')}</Badge>
        </OverlayTrigger>
      </td>
      <td>{props.trip.name}</td>
      <td>{countryFlags}</td>
    </tr>
  );
};

export default TripRow;
