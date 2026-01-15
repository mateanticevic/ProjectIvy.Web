import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ChartBar = (props) => {

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={props.data}>
                <XAxis dataKey="key" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="value" fill="var(--bs-primary)" unit={props.unit} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChartBar;
