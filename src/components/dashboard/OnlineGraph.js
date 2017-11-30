import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const OnlineGraph = (props) => {

    let data = _.map(props.data, x => {
        return { hours: _.round(x.seconds/3600, 1), day: moment(x.day).format("dddd Do") };
    });
    data = _.reverse(data);

    return (
        <LineChart width={600} height={300} data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hours" stroke="#337ab7" unit=" h" />
        </LineChart>
    );
};

export default OnlineGraph;