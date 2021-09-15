import React, { useEffect } from 'react';
import 'rc-slider/assets/index.css';
import { Range } from 'rc-slider';
import { Form, FormGroup, FormLabel } from 'react-bootstrap';

interface Props {
    precision: number;
    search: number;
    zoom: number;
    onPrecisionChange(precision: number): void;
    onSearchChange(search: number): void;
}

const presets = {
    [1]: { precision: 1, search: 0 },
    [2]: { precision: 1, search: 0 },
    [3]: { precision: 2, search: 0 },
    [4]: { precision: 3, search: 1 },
    [5]: { precision: 3, search: 1 },
    [6]: { precision: 4, search: 2 },
    [7]: { precision: 4, search: 2 },
    [8]: { precision: 5, search: 2 },
    [9]: { precision: 5, search: 3 },
    [10]: { precision: 6, search: 3 },
    [11]: { precision: 6, search: 4 },
    [12]: { precision: 6, search: 4 },
    [13]: { precision: 7, search: 5 },
    [14]: { precision: 7, search: 5 },
    [15]: { precision: 8, search: 5 },
    [16]: { precision: 8, search: 6 },
    [17]: { precision: 9, search: 6 }
};

const GeohashSettings = ({ precision, search, zoom, onPrecisionChange, onSearchChange }: Props) => {

    const [autoEnabled, setAutoEnabled] = React.useState(true);
    useEffect(() => {
        if (autoEnabled) {
            onPrecisionChange(presets[zoom].precision);
            onSearchChange(presets[zoom].search);
        }
    }, [autoEnabled, zoom]);

    return (
        <React.Fragment>
            <FormGroup>
                <Form.Check
                    type="checkbox"
                    checked={autoEnabled}
                    label="Auto"
                    onChange={() => setAutoEnabled(!autoEnabled)}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Precision</FormLabel>
                <Range
                    disabled={autoEnabled}
                    max={9}
                    marks={{
                        1: '1',
                        5: '5',
                        9: '9',
                    }}
                    min={1}
                    onChange={c => onPrecisionChange(c[0])}
                    step={1}
                    value={[precision]}
                />
            </FormGroup>
            <FormGroup className="margin-top-30">
                <FormLabel>Search</FormLabel>
                <Range
                    disabled={autoEnabled}
                    max={6}
                    marks={{
                        0: '0',
                        3: '3',
                        6: '6',
                    }}
                    min={0}
                    onChange={c => onSearchChange(c[0])}
                    step={1}
                    value={[search]}
                />
            </FormGroup>
        </React.Fragment>
    );
};

export default GeohashSettings;