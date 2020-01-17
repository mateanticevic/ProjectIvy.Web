import _ from 'lodash';
import React from 'react';
import { XAxis, BarChart, CartesianGrid, Tooltip, Legend, YAxis, Bar, ResponsiveContainer } from 'recharts';

interface Props {
    data: any;
    name: string;
    unit?: string;
    value: string;
}

const SimpleBarChart = ({ data, name, value }: Props) => {

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={data}>
                <XAxis dataKey={name} />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey={value} fill="#337ab7" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SimpleBarChart;
