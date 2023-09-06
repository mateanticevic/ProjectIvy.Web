import React from 'react';
import FormControl from 'react-bootstrap/FormControl';

import { SelectOption } from 'types/common';

interface Props {
    defaultOptionId?: string;
    defaultOptionValue?: string;
    hideDefaultOption?: boolean;
    options: SelectOption[];
    selected?: string;
    onChange: (id: string) => void;
}

const Select = ({ options, onChange, defaultOptionId, defaultOptionValue, selected, hideDefaultOption }: Props) => {

    defaultOptionId = defaultOptionId ? defaultOptionId : undefined;
    defaultOptionValue = defaultOptionValue ? defaultOptionValue : 'Any';

    const t = options && options[0] && options[0].id ? options : options.map((item) => ({ id: item, name: item }));

    const optionItems = t.map((option) => <option key={option.id} value={option.id}>{option.name}</option>);

    return (
        <FormControl
            as="select"
            onChange={(e) => onChange((e.target as HTMLInputElement).value)}
            placeholder="select"
            value={selected}
        >
            {!hideDefaultOption &&
                <option value={defaultOptionId}>{defaultOptionValue}</option>
            }
            {optionItems}
        </FormControl>
    );
};

export default Select;
