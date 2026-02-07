import React, { useEffect, useState } from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import api from 'api/main';
import { Timeline } from 'components';
import { components } from 'types/ivy-types';

type Car = components['schemas']['Car'];
type ViewMode = 'time' | 'km';

const CarTimelinePage = () => {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('time');

    useEffect(() => {
        const loadTimeline = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await api.car.get(id);
                setCar(data);
            } catch (error) {
                console.error('Failed to load car timeline:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTimeline();
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-4">
                <p className="text-center">Loading...</p>
            </Container>
        );
    }

    if (!car || !car.services || car.services.length === 0) {
        return (
            <Container className="mt-4">
                <p className="text-center text-muted">No timeline data available</p>
            </Container>
        );
    }

    const timelineItems = car.services
        .filter(service => {
            if (viewMode === 'time') {
                return service.date && service.serviceType;
            } else {
                return service.odometer && service.serviceType;
            }
        })
        .map(service => ({
            value: viewMode === 'time' ? new Date(service.date!) : service.odometer!,
            label: service.serviceType!.name || undefined,
            data: service
        }));

    return (
        <div className="mt-4" style={{ width: '100%', maxWidth: '100%' }}>
            <div className="d-flex justify-content-center mb-3">
                <ButtonGroup>
                    <Button
                        active={viewMode === 'time'}
                        onClick={() => setViewMode('time')}
                    >
                        Time
                    </Button>
                    <Button
                        active={viewMode === 'km'}
                        onClick={() => setViewMode('km')}
                    >
                        Km
                    </Button>
                </ButtonGroup>
            </div>
            <Timeline
                items={timelineItems}
                orientation="horizontal"
                valueType={viewMode === 'time' ? 'date' : 'number'}
                unit={viewMode === 'km' ? 'km' : undefined}
            />
        </div>
    );
};

export default CarTimelinePage;
