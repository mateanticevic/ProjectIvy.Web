import React from 'react';
import _ from 'lodash';
import { Card } from 'react-bootstrap';

import { Consumation } from 'types/beer';
import { ServingIcon } from './serving-icon';

interface Props {
    consumations: Consumation[];
}

const ConsumationItem = ({ consumations }: Props) => {
    const beer = consumations[0].beer;
    const sum = _.sum(consumations.map(x => x.volume));
    const amountFormatted = (sum / 1000).toFixed(2).toString();
    const amountWholePart = amountFormatted.substring(0, amountFormatted.indexOf('.'));
    const amountDecimalPart = amountFormatted.substring(amountFormatted.indexOf('.'));

    const name = beer.name?.includes(beer.brand.name) ? beer.name : `${beer.name} (${beer.brand.name})`;

    return (
        <Card>
            <Card.Body className="expense-item">
                <img
                    className="consumation-item-icon"
                    src={`https://cdn.anticevic.net/beers/${beer.id}.jpg`}
                    onError={x => x.target.src=''}
                />
                <div className="expense-item-content">
                    <div className="expense-item-title">
                        {name}
                    </div>
                    <div className="expense-item-date">
                        {beer.style &&
                            beer.style.name
                        }
                    </div>
                </div>
                <div className="expense-item-payment">
                    <div className="expense-item-payment-type">
                        {consumations.map(consumation =>
                            <ServingIcon
                                key={_.uniqueId()}
                                serving={consumation.serving}
                                title={`${consumation.volume}ml`}
                            />
                        )}
                    </div>
                    <span className="expense-item-amount">{amountWholePart}</span>
                    <span className="expense-item-amount-decimal">{amountDecimalPart}L</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ConsumationItem;