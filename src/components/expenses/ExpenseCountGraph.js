import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseCountGraph = (props) => {

    let data = _.map(props.data, x => {
        return { count: x.data, day: moment(`${x.year}-${x.month}-1`).format("MMMM YYYY") };
    });
    data = _.reverse(data);

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={data}>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="count" fill="#337ab7" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ExpenseCountGraph;