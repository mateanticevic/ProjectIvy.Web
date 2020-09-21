import React from 'react';
import { Badge } from 'react-bootstrap';

interface Props {
    volume: number;
}

export const VolumeBadge = ({ volume }: Props) => <Badge variant="primary" title={`${volume / 1000}L`}>{Math.ceil(volume / 1000)}L</Badge>;