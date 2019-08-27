import React from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import * as _ from 'lodash';

import * as formatHelper from '../../utils/formatHelper';
import { Movement } from './types';

const MovementRow = ({ day, distance, trackings, id, color, onRemoveTracking }: Movement) => {
    return (
        <tr>
            <td><span style={{ color }}>■</span> {moment(day).format("DD.MM.YYYY.")}</td>
            <td title="From"><FontAwesome name="hourglass-start" />&nbsp;{moment(_.min(trackings.map(x => x.timestamp))).format('HH:mm')}</td>
            <td title="To"><FontAwesome name="hourglass-end" />&nbsp;{moment(_.max(trackings.map(x => x.timestamp))).format('HH:mm')}</td>
            <td title="Max speed"><FontAwesome name="tachometer" />&nbsp;{Math.round(_.max(trackings.map(x => x.speed)) * 3.6)} km/h</td>
            <td title="Distance"><FontAwesome name="road" />&nbsp;{formatHelper.number(distance).number} {formatHelper.number(distance).exponent}m</td>
            <td className="width-30"><FontAwesome name="times" className="show-on-hover" onClick={() => onRemoveTracking(id)} /></td>
        </tr>
    );
};

export default MovementRow;