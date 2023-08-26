import _ from 'lodash';
import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import * as formatHelper from 'utils/format-helper';

interface Props {
    data: any;
    name: string;
    stacked?: boolean;
    unit?: string;
    value: string;
    onClick?(): void;
}

const tickFormatter = (value: number) => {
    const formattedNumber = formatHelper.number(value);
    return `${formattedNumber.number}${formattedNumber.exponent}`;
};

const colors = [
    '#0d6efa',
    '#9f5eeb',
    '#de49ce',
    '#ff3ba9',
    '#ff4681',
    '#ff635a',
    '#ff8634',
    '#ffa600',
];

const SimpleBarChart = ({ data, name, stacked, unit, value, onClick }: Props) =>
    <ResponsiveContainer height={250}>
        <BarChart
            data={data}
            onClick={onClick}
        >
            <XAxis dataKey={name} />
            <YAxis tickFormatter={tickFormatter} />
            <Tooltip />
            <Legend />
            {stacked && [...new Set(data.map(x => Object.keys(x)).flatMap(x => x))].filter(x => x !== 'key').map((x, i) =>
                <Bar
                    type="monotone"
                    dataKey={x}
                    fill={colors[i % 8]}
                    stackId="a"
                    unit={unit}
                />
            )}
            {!stacked &&
                <Bar type="monotone" dataKey={value} fill="#007bff" unit={unit} />
            }
        </BarChart>
    </ResponsiveContainer>;

export default SimpleBarChart;
