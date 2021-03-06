import _ from 'lodash';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    name: string;
    unit?: string;
    value: string;
}

const SimpleBarChart = ({ data, name, unit, value }: Props) =>
    <ResponsiveContainer height={300}>
        <BarChart data={data}>
            <XAxis dataKey={name} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar type="monotone" dataKey={value} fill="#007bff" unit={unit} />
        </BarChart>
    </ResponsiveContainer>;

export default SimpleBarChart;
