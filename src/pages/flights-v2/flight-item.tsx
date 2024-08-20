import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import { components } from 'types/ivy-types';
import { vendorUrl } from 'utils/cdn-helper';

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
                <img src={vendorUrl(airline!.id!)} />

                <div className="flight-origin-destination">
                    <h3>{flight!.origin!.iata} - {flight!.destination!.iata}</h3>
                </div>
                <div className="flight-item-date">
                    <h5>{moment(flight.departureLocal).format('MMMM Do YYYY')}</h5>
                </div>
                <div className="flight-item-distance">
                    <h5>{flight.distanceInKm} km</h5>
                </div>                
            </Card.Body>
        </Card>
    );
};

export default FlightItem;