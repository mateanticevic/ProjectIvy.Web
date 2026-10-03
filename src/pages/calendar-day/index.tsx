/* global google */
import React, { useEffect, useState } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { MarkerF, PolylineF } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';

import api from 'api/main';
import { Map } from 'components';
import { components } from 'types/ivy-types';
import colorTokens from 'styles/color-tokens.module.scss';

type Tracking = components['schemas']['Tracking'];

const CalendarDayPage = () => {
    const { year, month, day } = useParams();
    const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D', true);
    const dateKey = date.isValid() ? date.format('YYYY-MM-DD') : undefined;
    const [trackings, setTrackings] = useState<Tracking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [map, setMap] = useState<google.maps.Map>();
    const positions = trackings.map(tracking => ({ lat: tracking.latitude!, lng: tracking.longitude! }));

    useEffect(() => {
        let active = true;
        setTrackings([]);
        setError(undefined);
        if (!dateKey) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const start = moment.tz(dateKey, 'Europe/Zagreb');
        api.tracking.get({
            From: start.clone().utc().format('YYYY-MM-DDTHH:mm:ss'),
            To: start.clone().add(1, 'day').utc().format('YYYY-MM-DDTHH:mm:ss'),
            OrderAscending: true,
        })
            .then(response => {
                if (active) {
                    setTrackings(response.filter(tracking => tracking.latitude != null && tracking.longitude != null)
                        .sort((a, b) => moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf()));
                }
            })
            .catch(() => {
                if (active) {
                    setError('Failed to load trackings.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => { active = false; };
    }, [dateKey]);

    useEffect(() => {
        if (map && trackings.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            trackings.forEach(tracking => bounds.extend({ lat: tracking.latitude!, lng: tracking.longitude! }));
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                map.setCenter(bounds.getCenter());
                map.setZoom(15);
            } else {
                map.fitBounds(bounds);
            }
        }
    }, [map, trackings]);

    return (
        <Container>
            {!dateKey ? <Alert variant="warning">Invalid calendar date.</Alert> : <>
                {loading && <div className="text-center p-5"><Spinner animation="border" size="sm" /> Loading trackings...</div>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && <>
                    {trackings.length === 0 && <Alert variant="info">No trackings for this day.</Alert>}
                    <div style={{ height: '75vh' }}>
                        <Map key={dateKey} onLoad={setMap} defaultCenter={positions[0]}>
                            {positions.length > 1 && <PolylineF path={positions} options={{ strokeColor: colorTokens.colorPrimary, strokeWeight: 5 }} />}
                            {positions.length === 1 && <MarkerF position={positions[0]} />}
                        </Map>
                    </div>
                </>}
            </>}
        </Container>
    );
};

export default CalendarDayPage;
