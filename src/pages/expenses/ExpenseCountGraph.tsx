import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ExpenseCountGraph = (props) => {

    // let data = _.map(props.data, (x) => {
    //     return { count: x.data, day: moment(`${x.year}-${x.month}-1`).format('MMMM YYYY') };
    // });
    // data = _.reverse(data);

    return (
        <ResponsiveContainer height={300}>
            <BarChart data={_.reverse(props.data)}>
                <XAxis dataKey="key" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="value" fill="#337ab7" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ExpenseCountGraph;
