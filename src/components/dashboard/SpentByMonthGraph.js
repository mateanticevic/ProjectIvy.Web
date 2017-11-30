import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SpentByMonthGraph = (props) => {

    let data = _.map(props.data, x => {
        return { amount: x.data, month: moment(`${x.month}-${x.year}-1`).format("YYYY MMM") };
    });

    return (
        <LineChart width={600} height={300} data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#337ab7" unit=" kn" />
        </LineChart>
    );
};

export default SpentByMonthGraph;