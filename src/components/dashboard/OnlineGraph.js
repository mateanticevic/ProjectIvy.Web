import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const OnlineGraph = (props) => {
    return (
        <LineChart width={600} height={300} data={props.data}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="seconds" stroke="#337ab7" />
        </LineChart>
    );
};

export default OnlineGraph;