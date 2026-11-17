import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rectangle } from '@react-google-maps/api';
import geohash from 'ngeohash';

import api from 'api/main';
import { rectangleOptionsNonVisited, rectangleOptionsSelected, rectangleOptionsVisited } from './constants';

export interface GeohashViewport {
    south: number;
    west: number;
    north: number;
    east: number;
}

interface Props {
    bounds?: GeohashViewport;
    precision: number;
    refresh: number;
    selected: string[];
    onClick: (hash: string) => void;
}

// Check the cell count before enumerating: a world view at precision 7 has billions of cells.
export const visibleGeohashes = (bounds: GeohashViewport, precision: number): string[] | null => {
    const latSize = 180 / 2 ** Math.floor(precision * 5 / 2);
    const lngSize = 360 / 2 ** Math.ceil(precision * 5 / 2);
    const ranges = bounds.west > bounds.east
        ? [[bounds.west, 180], [-180, bounds.east]]
        : [[bounds.west, bounds.east]];
    const rowCount = Math.floor((bounds.north + 90) / latSize) - Math.floor((bounds.south + 90) / latSize) + 1;
    const cellCount = ranges.reduce((count, [west, east]) => count + rowCount * (Math.floor((east + 180) / lngSize) - Math.floor((west + 180) / lngSize) + 1), 0);
    if (cellCount > 2000) {
        return null;
    }

    return [...new Set(ranges.flatMap(([west, east]) => geohash.bboxes(bounds.south, west, bounds.north, east, precision)))];
};

// A viewport crossing the date line or a root-cell boundary needs the root parent.
export const viewportParent = (bounds: GeohashViewport, precision: number): string => {
    if (bounds.west > bounds.east || precision === 1) {
        return 'root';
    }
    const southWest = geohash.encode(bounds.south, bounds.west, precision - 1);
    const northEast = geohash.encode(bounds.north, bounds.east, precision - 1);
    let length = 0;
    while (length < southWest.length && southWest[length] === northEast[length]) {
        length++;
    }
    return southWest.slice(0, length) || 'root';
};

const ViewportGeohashes = ({ bounds, precision, refresh, selected, onClick }: Props) => {
    const hashes = useMemo(() => bounds ? visibleGeohashes(bounds, precision) : [], [bounds, precision]);
    const parent = bounds && hashes !== null ? viewportParent(bounds, precision) : undefined;
    const requestKey = parent ? `${parent}:${precision}:${refresh}` : undefined;
    const cache = useRef(new Map<string, Promise<Set<string>>>());
    const [loaded, setLoaded] = useState(new Map<string, boolean>());
    const mounted = useRef(false);
    const currentRefresh = useRef(refresh);
    currentRefresh.current = refresh;

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);
    const [failedKey, setFailedKey] = useState<string>();

    useEffect(() => {
        cache.current.clear();
    }, [refresh]);

    useEffect(() => {
        if (!parent || !requestKey || !hashes) {
            return;
        }
        let request = cache.current.get(requestKey);
        if (!request) {
            request = api.geohash.getChildren(parent, { Precision: precision })
                .then(hashes => new Set(hashes));
            cache.current.set(requestKey, request);
        }
        request.then(visited => {
            if (mounted.current && currentRefresh.current === refresh) {
                setLoaded(previous => {
                    const next = new Map(previous);
                    hashes.forEach(hash => next.set(hash, visited.has(hash)));
                    return next;
                });
                setFailedKey(undefined);
            }
        }).catch(() => {
            cache.current.delete(requestKey);
            if (mounted.current && currentRefresh.current === refresh) {
                setFailedKey(requestKey);
            }
        });
    }, [hashes, parent, precision, refresh, requestKey]);

    const failed = failedKey !== undefined && failedKey === requestKey;

    return <>
        {(hashes === null || failed) &&
            <div role="status" className="position-absolute top-0 start-50 translate-middle-x bg-body rounded p-2 mt-2 shadow-sm">
                {hashes === null ? 'Zoom in to show geohashes at this precision.' : 'Could not load geohashes.'}
            </div>
        }
        {[...loaded].map(([hash, visited]) => {
            const [south, west, north, east] = geohash.decode_bbox(hash);
            const options = selected.includes(hash) ? rectangleOptionsSelected
                : visited ? rectangleOptionsVisited : rectangleOptionsNonVisited;
            return <Rectangle
                key={hash}
                bounds={{ south, west, north, east }}
                options={options}
                onClick={() => onClick(hash)}
            />;
        })}
    </>;
};

export default ViewportGeohashes;
