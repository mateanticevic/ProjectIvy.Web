import _ from 'lodash';
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: any;
    unit?: string;
}

const SimpleLineChart = ({ data, unit }: Props) => {

    return (
        <ResponsiveContainer height={300}>
            <LineChart data={data}>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dot={false} dataKey="hours" stroke="#337ab7" unit={unit ?? '' } />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SimpleLineChart;
