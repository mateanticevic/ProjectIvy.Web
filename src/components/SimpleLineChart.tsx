import _ from 'lodash';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    name: string;
    unit?: string;
    value: string;
}

const SimpleLineChart = ({ data, name, unit, value }: Props) => {

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis dataKey={name} />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dot={false} dataKey={value} stroke="#337ab7" unit={unit ?? '' } />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SimpleLineChart;
