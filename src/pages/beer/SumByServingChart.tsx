import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DataPoint {
    name: string;
    value: string;
}

interface Props {
    data: DataPoint[];
}

export const SumByServingChart = ({ data }: Props) => {

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);

        return (
       <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
           {`${data[index].name} ${Math.ceil(data[index].value / 1000)}L`}
       </text>
     );
   };

    return (
        <ResponsiveContainer height={300}>
            <PieChart>
                <Pie isAnimationActive={false} data={data} cx={120} cy={90} outerRadius={70} fill="#b5eeff" label={renderCustomizedLabel} labelLine={false} />
            </PieChart>
        </ResponsiveContainer>
    );
};
