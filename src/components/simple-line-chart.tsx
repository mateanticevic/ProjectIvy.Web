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
    const lineValueKey = value ?? 'value';
    const axisTickColor = 'var(--bs-body-color)';
    const legendFormatter = (legendValue: string) => (
        <span style={legendValue === lineValueKey ? { color: 'var(--bs-body-color)' } : undefined}>{legendValue}</span>
    );

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis
                    dataKey={name ?? 'key'}
                    tickFormatter={time => moment(time).format('MMM Do YY')}
                    tick={{ fill: axisTickColor }}
                />
                <YAxis domain={['auto', 'auto']} tick={{ fill: axisTickColor }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend formatter={legendFormatter} />
                <Line
                    type="monotone"
                    dot={false}
                    dataKey={lineValueKey}
                    stroke="var(--bs-primary)"
                    strokeWidth={3}
                    unit={unit ?? ''}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};