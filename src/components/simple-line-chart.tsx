import moment from 'moment';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    name?: string;
    tickFormat?: string;
    unit?: string;
    value?: string;
}

export const SimpleLineChart = ({ data, name, tickFormat, unit, value }: Props) => {
    const lineValueKey = value ?? 'value';
    const axisFormat = tickFormat ?? 'MMM Do YY';
    const axisTickColor = 'var(--bs-body-color)';
    const legendFormatter = (legendValue: string) => (
        <span style={legendValue === lineValueKey ? { color: 'var(--bs-body-color)' } : undefined}>{legendValue}</span>
    );

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis
                    dataKey={name ?? 'key'}
                    tickFormatter={time => moment(time).format(axisFormat)}
                    tick={{ fill: axisTickColor }}
                />
                <YAxis domain={['auto', 'auto']} tick={{ fill: axisTickColor }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip labelFormatter={tickFormat ? time => moment(time).format(axisFormat) : undefined} />
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