import React from 'react';
import _ from 'lodash';
import { Badge, Card } from 'react-bootstrap';

import { Consumation } from 'types/beer';
import { ServingIcon } from './ServingIcon';

interface Props {
    consumations: Consumation[];
}

const ConsumationItem = ({ consumations }: Props) => {
    const beer = consumations[0].beer;
    const sum = _.sum(consumations.map(x => x.volume));
    const amountFormatted = (sum / 1000).toFixed(1).toString();
    const amountWholePart = amountFormatted.substring(0, amountFormatted.indexOf('.'));
    const amountDecimalPart = amountFormatted.substring(amountFormatted.indexOf('.'));

    return (
        <Card>
            <Card.Body className="expense-item">
                <Badge
                    bg="primary"
                    className="expense-type-badge"
                >
                    {beer.abv?.toFixed(1)}%
                </Badge>
                <div className="expense-item-content">
                    <div className="expense-item-title">
                        {beer.name}
                    </div>
                    <div className="expense-item-date">
                        {beer.style &&
                            `${beer.style.name}`
                        }
                        {'Lager'}
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