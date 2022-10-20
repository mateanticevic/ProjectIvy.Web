import React from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { Expense } from 'types/expenses';

interface Props {
    expense: Expense;
}

const VendorLabel = ({ expense }: Props) => {

    const poiNameTooltip = (
        <Tooltip id="tooltip">
            {expense.poi && expense.poi.name}
        </Tooltip>
    );

    return (
        <div>
            {expense.vendor &&
                <Badge variant="primary">{expense.vendor.name}&nbsp;
                    {expense.poi &&
                        <OverlayTrigger placement="right" overlay={poiNameTooltip}>
                            <FontAwesome name="map-marker" />
                        </OverlayTrigger>
                    }
                </Badge>
            }
        </div>
    );
};

export default VendorLabel;
