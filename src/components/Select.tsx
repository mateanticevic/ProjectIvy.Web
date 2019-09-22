import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';

interface Props {
  options: any[];
  onChange: (id: string) => void;
  defaultOptionId?: string;
  defaultOptionValue?: string;
  selected?: string;
  hideDefaultOption?: boolean;
}

const Select: React.SFC<Props> = ({ options, onChange, defaultOptionId, defaultOptionValue, selected, hideDefaultOption }) => {

  defaultOptionId = defaultOptionId ? defaultOptionId : undefined;
  defaultOptionValue = defaultOptionValue ? defaultOptionValue : 'Any';

  const t = options && options[0] && options[0].id ? options : options.map((item) => ({ id: item, name: item}));

  options = t.map((option) => <option key={option.id} value={option.id}>{option.name}</option>);

  return (
    <FormControl value={selected} componentClass="select" onChange={(e) => onChange((e.target as HTMLInputElement).value)} placeholder="select">
      {!hideDefaultOption &&
        <option value={defaultOptionId}>{defaultOptionValue}</option>
      }
      {options}
    </FormControl>
  );
};

export default Select;
