import React, { ReactNode } from 'react';
import { GiBeerBottle, GiSodaCan, GiWaterBottle } from 'react-icons/gi';
import { TiBeer } from 'react-icons/ti';

interface Props {
    serving: string;
}

interface Mapping {
    [serving: string]: ReactNode;
}

const mapping: Mapping = {
    'Can': <GiSodaCan size={20} />,
    'OnTap': <TiBeer size={20} />,
    'Bottle': <GiBeerBottle size={20} />,
    'Plastic': <GiWaterBottle size={20} />,
};

export const ServingIcon = ({ serving }: Props) =>
    <div title={serving}>
        {mapping[serving]}
    </div>;
