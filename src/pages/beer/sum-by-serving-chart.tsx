import React from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

interface Props {
    data: DataPoint[];
}

export const SumByServingChart = ({ data }: Props) => {
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

        if (!payload) {
            return null;
        }

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const name = payload.name ?? 'Unknown';
        const value = Number(payload.value ?? 0);

        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${name} ${Math.ceil(value / 1000)}L`}
            </text>
        );
    };

    return (
        <ResponsiveContainer height={300}>
            <PieChart>
                <Pie
                    isAnimationActive={false}
                    data={data}
                    cx={120}
                    cy={90}
                    outerRadius={70}
                    fill='var(--bs-primary)'
                    label={renderCustomizedLabel}
                    labelLine={false}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
