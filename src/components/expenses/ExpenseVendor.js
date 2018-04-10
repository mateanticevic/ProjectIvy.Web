import React from 'react';
import FontAwesome from 'react-fontawesome';
import { OverlayTrigger, Tooltip, Label } from 'react-bootstrap/lib';

const ExpenseVendor = (props) => {

    const poiNameTooltip = (
        <Tooltip id="tooltip">
            {props.expense.poi && props.expense.poi.name}
        </Tooltip>
    );

    return (
        <div>
            {props.expense.vendor &&
                <Label bsStyle="primary">{props.expense.vendor.name}&nbsp;
            {props.expense.poi &&
                        <OverlayTrigger placement="right" overlay={poiNameTooltip}>
                            <FontAwesome name="map-marker" />
                        </OverlayTrigger>}</Label>
            }
        </div>
    );
}

export default ExpenseVendor;