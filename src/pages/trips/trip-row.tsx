import moment from 'moment';
import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';

import { components } from 'types/ivy-types';

type Trip = components['schemas']['Trip'];

interface Props {
    trip: Trip,
}

const TripRow = ({ trip }: Props) => {

    const yearTooltip = (
        <Tooltip id="tooltip">
            From {moment(trip.timestampStart).format('Do MMMM YYYY')} to {moment(trip.timestampEnd).format('Do MMMM YYYY')}
        </Tooltip>
    );

    const countryFlags = trip.countries?.map(country => {
        const countryClassName = 'flag-icon flag-icon-' + country.id.toLowerCase();
        return <span key={country.id} title={country.name}><span className={countryClassName} />&nbsp;</span>;
    });

    return (
        <tr key={trip.id} className="cursor-pointer" onClick={() => window.location.assign(`/trips/${trip.id}`)}>
            <td>
                <OverlayTrigger placement="left" overlay={yearTooltip}>
                    <Badge variant={moment(trip.timestampStart).isAfter(moment(), 'day') ? 'success' : 'primary'}>{moment(trip.timestampStart).format('YYYY')}</Badge>
                </OverlayTrigger>
            </td>
            <td>{trip.name}</td>
            <td>{countryFlags}</td>
        </tr>
    );
};

export default TripRow;
