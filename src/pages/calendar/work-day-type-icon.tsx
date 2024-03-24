import React from 'react';
import { FaBusinessTime, FaLaptop } from 'react-icons/fa';
import { FaTemperatureFull } from 'react-icons/fa6';
import { GiPalmTree } from 'react-icons/gi';
import { MdBusinessCenter } from 'react-icons/md';
import { RiPresentationFill } from 'react-icons/ri';

enum WorkDayType {
    Office = 'office',
    Remote = 'remote',
    Vacation = 'vacation',
    SickLeave = 'sick-leave',
    BusinessTrip = 'business-trip',
    Conference = 'conference',
}

interface Props {
    id?: string | null;
}

export const WorkDayTypeIcon = ({ id }: Props) => {
    if (id === WorkDayType.BusinessTrip) {
        return <FaBusinessTime />;
    }
    else if (id === WorkDayType.Office) {
        return <MdBusinessCenter />;
    }
    else if (id === WorkDayType.Remote) {
        return <FaLaptop />;
    }
    else if (id === WorkDayType.Conference) {
        return <RiPresentationFill />;
    }
    else if (id === WorkDayType.Vacation) {
        return <GiPalmTree />;
    }
    else if (id === WorkDayType.SickLeave) {
        return <FaTemperatureFull />;
    }
    else if (!id) {
        return <MdBusinessCenter />;
    }

    return <MdBusinessCenter />;
}