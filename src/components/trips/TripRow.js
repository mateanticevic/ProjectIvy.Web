import React from 'react';
import Moment from 'react-moment';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Label from 'react-bootstrap/lib/Label';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

const TripRow = (props) => {

  const yearTooltip = (
    <Tooltip id="tooltip">
      From <Moment format="Do MMMM YYYY">{props.trip.timestampStart}</Moment> to <Moment format="Do MMMM YYYY">{props.trip.timestampEnd}</Moment>.
    </Tooltip>
  );

  const countryFlags = props.trip.countries.map(function(country){
    let countryClassName = "flag-icon flag-icon-" + country.id.toLowerCase();
    return <span key={country.id} title={country.name}><span className={countryClassName}/>&nbsp;</span>;
  });

  return (
  <tr key={props.trip.id}>
      <td>
        <OverlayTrigger placement="left" overlay={yearTooltip}>
          <Label bsStyle="primary"><Moment format="YYYY">{props.trip.timestampStart}</Moment></Label>
        </OverlayTrigger>
      </td>
      <td>{countryFlags}</td>
      <td>{props.trip.name}</td>
      <td><Moment to={props.trip.timestampEnd} ago>{props.trip.timestampStart}</Moment></td>
      <td><Link to={`/trips/${props.trip.id}`}><FontAwesome name="eye" /></Link></td>
  </tr>
  );
};

export default TripRow;

TripRow.propTypes = {
  trip: React.PropTypes.object
};