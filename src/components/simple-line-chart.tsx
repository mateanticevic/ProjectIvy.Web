import moment from 'moment';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    name: string;
    unit?: string;
    value: string;
}

export const SimpleLineChart = ({ data, name, unit, value }: Props) => {

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis
                    dataKey={name}
                    domain={['auto', 'auto']}
                    tickFormatter={time => moment(time).format('MMM Do YY')}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dot={false} dataKey={value} stroke="#007bff" unit={unit ?? ''} />
            </LineChart>
        </ResponsiveContainer>
    );
};