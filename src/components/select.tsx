import React from 'react';
import FormControl from 'react-bootstrap/FormControl';

import { SelectOption } from 'types/common';

interface Props {
    defaultOptionId?: string;
    defaultOptionValue?: string;
    hideDefaultOption?: boolean;
    options: SelectOption[];
    defaultSelected?: string;
    selected?: string;
    onBlur?: () => void;
    onChange: (id: string) => void;
}

const Select = ({ defaultSelected, options, defaultOptionId, defaultOptionValue, selected, hideDefaultOption, onBlur, onChange }: Props) => {

    defaultOptionId = defaultOptionId ? defaultOptionId : undefined;
    defaultOptionValue = defaultOptionValue ? defaultOptionValue : 'Any';

    const t = options && options[0] && options[0].id ? options : options.map((item) => ({ id: item, name: item }));

    const optionItems = t.map(option => <option key={option.id} value={option.id} disabled={!!option.disabled}>{option.name}</option>);

    return (
        <FormControl
            as="select"
            defaultValue={defaultSelected}
            placeholder="select"
            value={selected}
            onBlur={onBlur}
            onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        >
            {!hideDefaultOption &&
                <option value={defaultOptionId}>{defaultOptionValue}</option>
            }
            {optionItems}
        </FormControl>
    );
};

export default Select;
