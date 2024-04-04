import React from 'react';
import { Rectangle } from '@react-google-maps/api';
import ngeohash from 'ngeohash';

interface Props {
    geohash: string;
    options?: google.maps.RectangleOptions;
    onClick(geohash: string): void;
}

export const GeohashRectangle = ({ geohash, options, onClick }: Props) => {
    const rectangle = ngeohash.decode_bbox(geohash);

    return (
        <Rectangle
            key={geohash}
            options={options}
            bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
            onClick={e => onClick(geohash)}
        />
    );
}