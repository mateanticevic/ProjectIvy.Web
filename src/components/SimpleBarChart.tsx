import _ from 'lodash';
import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import * as formatHelper from 'utils/format-helper';

interface Props {
    data: any;
    name: string;
    unit?: string;
    value: string;
}

const tickFormatter = (value: number) => {
    const formattedNumber = formatHelper.number(value);
    return `${formattedNumber.number}${formattedNumber.exponent}`;
};

const SimpleBarChart = ({ data, name, unit, value }: Props) =>
    <ResponsiveContainer height={300}>
        <BarChart data={data}>
            <XAxis dataKey={name} />
            <YAxis name="kn" tickFormatter={tickFormatter} />
            <Tooltip />
            <Legend />
            <Bar type="monotone" dataKey={value} fill="#007bff" unit={unit} />
        </BarChart>
    </ResponsiveContainer>;

export default SimpleBarChart;
