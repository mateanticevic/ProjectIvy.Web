import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartBar = (props) => {

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={props.data}>
                <XAxis dataKey="key" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="value" fill="#337ab7" unit={props.unit} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChartBar;