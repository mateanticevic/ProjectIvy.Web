import React from 'react';
import { Modal } from 'react-bootstrap';
import { Polyline } from '@react-google-maps/api';

import { Map } from 'components';
import { components } from 'types/ivy-types';
import { trackingsToLatLng } from 'utils/gmap-helper';
import api from 'api/main';

type Tracking = components['schemas']['Tracking'];

interface Props {
    isOpen: boolean;
    from?: string;
    to?: string;
    onClose(): void;
}

const TrackingModal = ({ isOpen, onClose, from, to }: Props) => {
    const [map, setMap] = React.useState<google.maps.Map | undefined>(undefined);
    const [polyline, setPolyline] = React.useState<google.maps.Polyline | null>(null);
    const [trackings, setTrackings] = React.useState<Tracking[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isOpen && from && to) {
            setLoading(true);
            api.tracking.get({ from, to })
                .then(trackings => {
                    setTrackings(trackings);
                })
                .catch(error => {
                    console.error('Failed to fetch trackings:', error);
                    setTrackings([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (map && polyline && trackings.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            polyline.getPath().forEach((location) => {
                bounds.extend(location);
            });
            map.fitBounds(bounds);
        }
    }, [map, trackings, polyline]);

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            size="xl"
        >
            <Modal.Body className="map-modal-body">
                {loading ? (
                    <div className="text-center p-5">Loading trackings...</div>
                ) : (
                    <Map onLoad={map => setMap(map)}>
                        {trackings.length > 0 && (
                            <Polyline
                                onLoad={polyline => setPolyline(polyline)}
                                path={trackingsToLatLng(trackings)}
                                options={{ strokeColor: '#0000FF', strokeWeight: 5 }}
                            />
                        )}
                    </Map>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default TrackingModal;
