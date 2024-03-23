import React from 'react';
import { Modal } from 'react-bootstrap';
import { Polyline } from '@react-google-maps/api';

import { Map } from 'components';
import { components } from 'types/ivy-types';
import { trackingsToLatLng } from 'utils/gmap-helper';

type Tracking = components['schemas']['Tracking'];

interface Props {
    isOpen: boolean;
    trackings: Tracking[];
    onClose(): void;
}

const MapModal = ({ isOpen, onClose, trackings }: Props) => {
    const [map, setMap] = React.useState<google.maps.Map | undefined>(undefined);
    const [polyline, setPolyline] = React.useState<google.maps.Polyline | null>(null);

    React.useEffect(() => {
        if (map && polyline) {
            console.log('fitting bounds');
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
            size="lg"
        >
            <Modal.Body className="map-modal-body">
                <Map onLoad={map => setMap(map)}>
                    {trackings.length > 0 && (
                        <Polyline
                            onLoad={polyline => setPolyline(polyline)}
                            path={trackingsToLatLng(trackings)}
                        />
                    )}
                </Map>
            </Modal.Body>
        </Modal>
    );
};

export default MapModal;
