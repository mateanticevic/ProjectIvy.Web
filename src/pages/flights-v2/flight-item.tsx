import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import { components } from 'types/ivy-types';

type Flight = components['schemas']['Flight'];

interface Props {
    flight: Flight,
    onClick(): void,
}

const FlightItem = ({ flight, onClick }: Props) => {
    const { airline } = flight;
    return (
        <Card onClick={onClick}>
            <Card.Body className="flight-item">
                <img src={`https://cdn.anticevic.net/vendors/${airline.id}.jpg`} />

                <div className="flight-origin-destination">
                    <h3>{flight!.origin!.iata} - {flight!.destination!.iata}</h3>
                </div>
                <div className="flight-item-date">
                    <h3>{moment(flight.departure).format('MMMM D YYYY')}</h3>
                </div>
            </Card.Body>
        </Card>
    );
};

export default FlightItem;