import React, { useState } from 'react';

interface Props {
    options: Array<{ name: string, value: any }>;
    onSelect(value: any): void;
}

export const RadioLabel = ({ onSelect, options }: Props) => {

    const [selected, setSelected] = useState(options[0].value);

    const onClick = (selected: any) => {
        onSelect(selected);
        setSelected(selected);
    };

    return options.map(option => option.value == selected ? <strong className="cursor-pointer" onClick={() => onClick(option.value)}>{option.name} </strong> : <span className="cursor-pointer" onClick={() => onClick(option.value)}>{option.name} </span>);
};
