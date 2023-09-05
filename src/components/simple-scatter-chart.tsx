import moment from 'moment';
import React from 'react';
import { ScatterChart, Scatter, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const SimpleScatterChart = ({ data, unit }) =>
    <ResponsiveContainer width='95%' height={400} >
        <ScatterChart>
            <XAxis
                dataKey='timestamp'
                domain={['auto', 'auto']}
                name='Time'
                tickFormatter={unixTime => moment(unixTime).format('YYYY MMM')}
                type='number'
            />
            <YAxis
                dataKey='odometer'
                name='Value'
                unit={unit ?? ''}
            />

            <Scatter
                data={data}
                line={{ stroke: '#eee', strokeWidth: 5 }}
                lineJointType='monotoneX'
                lineType="joint"
                name='Values'
            />
            <Tooltip />

        </ScatterChart>
    </ResponsiveContainer>;
