import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import FontAwesome from 'react-fontawesome';

import * as formatHelper from '~utils/formatHelper';
import { Movement } from './types';

const MovementRow = ({ day, distance, trackings, id, color, onRemoveClick, onChartsClick }: Movement) => {
    return (
        <tr>
            <td title={moment(day).format('dddd')}><span style={{ color }}>■</span> {moment(day).format('DD.MM.YYYY.')}</td>
            <td title="From"><FontAwesome name="hourglass-start" />&nbsp;{moment(_.min(trackings.map((x) => x.timestamp))).format('HH:mm')}</td>
            <td title="To"><FontAwesome name="hourglass-end" />&nbsp;{moment(_.max(trackings.map((x) => x.timestamp))).format('HH:mm')}</td>
            <td title="Max speed"><FontAwesome name="tachometer" />&nbsp;{Math.round(_.max(trackings.map(x => x?.speed ? x.speed : 0)) * 3.6)} km/h</td>
            <td title="Distance"><FontAwesome name="road" />&nbsp;{formatHelper.number(distance).number} {formatHelper.number(distance).exponent}m</td>
            <td className="width-30">
                <FontAwesome title="Show charts" name="line-chart" className="show-on-hover cursor-pointer" onClick={() => onChartsClick(id)} />
            </td>
            <td className="width-30">
                <FontAwesome title="Remove" name="times" className="show-on-hover cursor-pointer" onClick={() => onRemoveClick(id)} />
            </td>
        </tr>
    );
};

export default MovementRow;
