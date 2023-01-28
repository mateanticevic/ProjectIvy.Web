import React from 'react';

import { components } from 'types/ivy-types';
import TripItem from './trip-item';

type Trip = components['schemas']['Trip'];

interface Props {
    trips: Trip[];
    year: string;
}

const YearTrips = ({ trips, year }: Props) => {
    return (
        <React.Fragment>
            <div>
                <h2>{year}</h2>
            </div>
            {trips.map(trip =>
                <TripItem
                    key={trip.id}
                    trip={trip}
                />
            )}
        </React.Fragment>
    );
};

export default YearTrips;