import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { ScatterChart, Scatter, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const SimpleScatterChart = ({ data }) =>
    <ResponsiveContainer width='95%' height={500} >
        <ScatterChart>
            <XAxis
                dataKey='timestamp'
                domain={['auto', 'auto']}
                name='Time'
                tickFormatter={unixTime => moment(unixTime).format('YYYY MMM')}
                type='number'
            />
            <YAxis dataKey='odometer' name='Value' />

            <Scatter
                data={data}
                line={{ stroke: '#eee' }}
                lineJointType='monotoneX'
                lineType='joint'
                name='Values'
            />

        </ScatterChart>
    </ResponsiveContainer>;
