import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SpentByMonthGraph = (props) => {

    let data = _.map(props.data, x => {
        return { amount: x.data, month: moment(`${x.year}-${x.month}-1`).format("YYYY MMM") };
    });

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="amount" fill="#337ab7" unit=" kn" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SpentByMonthGraph;