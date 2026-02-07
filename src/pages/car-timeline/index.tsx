import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import api from 'api/main';
import { Timeline } from 'components';
import { components } from 'types/ivy-types';

type Car = components['schemas']['Car'];

const CarTimelinePage = () => {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

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
        .filter(service => service.date && service.serviceType)
        .map(service => ({
            value: new Date(service.date!),
            label: service.serviceType!.name || undefined,
            data: service
        }));

    return (
        <div className="mt-4" style={{ width: '100%', maxWidth: '100%' }}>
            <Timeline
                items={timelineItems}
                orientation="horizontal"
                valueType="date"
                leftPadding={true}
                rightPadding={true}
            />
        </div>
    );
};

export default CarTimelinePage;
