import moment from 'moment';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { components } from 'types/ivy-types';

type Stay = components['schemas']['Stay'];

interface StayItemProps {
    stay: Stay;
    onEdit: (stay: Stay) => void;
}

export const StayItem: React.FC<StayItemProps> = ({ stay, onEdit }) => {
    return (
        <div className="stay-item" onClick={() => onEdit(stay)} role="button" tabIndex={0}>
            {stay.isBooked && (
                <div className="stay-booked-indicator">
                    <FaCheckCircle />
                </div>
            )}
            <div className="stay-content">
                <strong>{stay.city?.name || 'Unnamed Stay'}</strong>
                <div className="text-muted small">
                    {moment(stay.from).format('MMM DD')} - {moment(stay.to).diff(moment(stay.from), 'days')} nights
                </div>
            </div>
        </div>
    );
};
