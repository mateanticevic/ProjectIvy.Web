import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import ConsumationItem from './consumation-item';
import { components } from 'types/ivy-types';

type Consumation = components['schemas']['Consumation'];

interface Props {
    day: string;
    consumations: Consumation[];
}

const formatDate = (date) => moment().diff(moment(date), 'days') > 6 ? moment(date).format('Do MMMM YYYY') : moment(date).format('dddd');

const DayConsumations = ({ day, consumations }: Props) => {
    const consumationsByBeer = _.groupBy(consumations, consumation => consumation!.beer!.id);
    const beerIds = Object.keys(consumationsByBeer);

    return (
        <React.Fragment>
            <h2><Link to={`/calendar/${moment(day).format('YYYY/M/D')}`}>{formatDate(day)}</Link></h2>
            {beerIds.map(beerId =>
                <ConsumationItem
                    key={beerId}
                    consumations={consumationsByBeer[beerId]}
                />
            )}
        </React.Fragment>
    );
};

export default DayConsumations;
