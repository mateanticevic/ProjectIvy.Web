import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DataPoint {
    name: string;
    value: string;
}

interface Props {
    data: DataPoint[];
}

export const CountByChart = ({ data }: Props) => {

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${data[index].name} ${Math.round(percent * 100)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer height={320}>
            <PieChart>
                <Pie isAnimationActive={false} data={data} cx={180} cy={150} outerRadius={150} fill="#337ab7" label={renderCustomizedLabel} labelLine={false} />
            </PieChart>
        </ResponsiveContainer>
    );
};
