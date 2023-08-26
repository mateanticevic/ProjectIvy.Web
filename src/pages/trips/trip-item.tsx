import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { components } from 'types/ivy-types';

type Trip = components['schemas']['Trip'];

interface Props {
    trip: Trip;
}

const TripItem = ({ trip }: Props) => {

    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(`/trips/${trip.id}`)}>
            <Card.Body className="trip-item">
                <h5>
                    {trip.name}
                </h5>
                <div className="trip-item-flags">
                    {trip.countries?.map(country =>
                        <span
                            key={country.id}
                            title={country.name}
                        >
                            <span className={`flag-icon flag-icon-${country.id?.toLowerCase()}`} />&nbsp;
                        </span>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default TripItem;