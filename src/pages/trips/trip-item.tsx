import moment from 'moment';
import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { components } from 'types/ivy-types';

type Trip = components['schemas']['Trip'];

interface Props {
    trip: Trip;
}

const TripItem = ({ trip }: Props) => {

    const start = moment(trip.timestampStart);
    const end = moment(trip.timestampEnd);
    const numberOfDays = end.diff(start, 'days') + (end.hour() > 5 ? 1 : 0);
    
    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(`/trips/${trip.id}`)}>
            <Card.Body>
                <h3>
                    <Badge bg="primary">
                        {numberOfDays}
                    </Badge>
                </h3>
                <h2>
                    {trip.name}
                </h2>
                {trip.countries?.map(country =>
                    <span
                        key={country.id}
                        title={country.name}
                    >
                        <span className={`flag-icon flag-icon-${country.id?.toLowerCase()}`} />&nbsp;
                    </span>
                )}
            </Card.Body>
        </Card>
    );
};

export default TripItem;