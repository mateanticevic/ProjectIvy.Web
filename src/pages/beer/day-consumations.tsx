import moment from 'moment';
import React from 'react';
import _ from 'lodash';

import { Consumation } from 'types/beer';
import ConsumationItem from './consumation-item';

interface Props {
    day: string;
    consumations: Consumation[];
}

const formatDate = (date) => moment().diff(moment(date), 'days') > 6 ? moment(date).format('Do MMMM YYYY') : moment(date).format('dddd');

const DayConsumations = ({ day, consumations }: Props) => {
    const consumationsByBeer = _.groupBy(consumations, consumation => consumation.beer.id);
    const beerIds = Object.keys(consumationsByBeer);

    return (
        <React.Fragment>
            <h2>{formatDate(day)}</h2>
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