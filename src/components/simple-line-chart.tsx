import moment from 'moment';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    name?: string;
    unit?: string;
    value?: string;
}

export const SimpleLineChart = ({ data, name, unit, value }: Props) => {

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis
                    dataKey={name ?? 'key'}
                    tickFormatter={time => moment(time).format('MMM Do YY')}
                />
                <YAxis min={60} max={100} domain={[85, 100]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dot={false} dataKey={value ?? 'value'} stroke="var(--bs-primary)" unit={unit ?? ''} />
            </LineChart>
        </ResponsiveContainer>
    );
};