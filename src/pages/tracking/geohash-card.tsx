import React from 'react';
import { Card, Form, FormGroup, FormLabel, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

interface Props {
    enabled: boolean;
    precision: number;
    onEnabledChange: (enabled: boolean) => void;
    onPrecisionChange: (precision: number) => void;
}

const GeohashCard = ({ enabled, precision, onEnabledChange, onPrecisionChange }: Props) => {
    return (
        <Card>
            <Card.Header>Geohashes</Card.Header>
            <Card.Body>
                <FormGroup>
                    <Form.Check
                        id="geohashes-enabled"
                        type="switch"
                        role="switch"
                        label="Show geohashes"
                        checked={enabled}
                        onChange={event => onEnabledChange(event.target.checked)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Geohash precision</FormLabel>
                    <ToggleButtonGroup
                        name="geohash-precision"
                        size="sm"
                        type="radio"
                        value={precision}
                        onChange={onPrecisionChange}
                    >
                        {[1, 2, 3, 4, 5, 6, 7].map(value =>
                            <ToggleButton key={value} id={`geohash-precision-${value}`} value={value}>{value}</ToggleButton>
                        )}
                    </ToggleButtonGroup>
                </FormGroup>
            </Card.Body>
        </Card>
    );
};

export default GeohashCard;
