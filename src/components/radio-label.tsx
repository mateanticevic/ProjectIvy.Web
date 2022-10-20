import React, { useState } from 'react';
import _ from 'lodash';
import { DropdownButton, NavItem, Dropdown } from 'react-bootstrap';

interface Props {
    options: Array<{ name: string, value: any }>;
    onSelect(value: any): void;
}

export const RadioLabel = ({ onSelect, options }: Props) => {

    const [selected, setSelected] = useState(options[0]);

    const onClick = (selected: any) => {
        onSelect(selected.value);
        setSelected(selected);
    };

    const title = `Group by ${selected.name}`;

    return (
        <DropdownButton
            id={_.uniqueId('dropdown_button_')}
            title={title}
            size="sm"
        >
            {options.map((option, index) =>
                <Dropdown.Item
                    key={option.value}
                    onClick={() => onClick(option)}
                >
                    {option.name}
                </Dropdown.Item>
            )}
        </DropdownButton>
    );
};
