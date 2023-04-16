import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import { Flight } from 'types/flights';

interface Props {
    flight: Flight
}

const FlightItem = ({ flight }: Props) => {
    const { airline } = flight;
    return (
        <Card>
            <Card.Body className="flight-item">
                <img src={`https://cdn.anticevic.net/vendors/${airline.id}.jpg`} />

                <div className="flight-origin-destination">
                    <h3>{flight.origin.iata} - {flight.destination.iata}</h3>
                </div>
                <div className="flight-item-date">
                    <h3>{moment(flight.departure).format('MMMM D YYYY')}</h3>
                </div>
            </Card.Body>
        </Card>
    );
};

export default FlightItem;