import React from 'react';
import { FaLaptop } from 'react-icons/fa';
import { FaTemperatureFull } from 'react-icons/fa6';
import { GiPalmTree } from 'react-icons/gi';
import { ImOffice } from 'react-icons/im';
import { MdBusinessCenter } from 'react-icons/md';

enum WorkDayType {
    Office = 'office',
    Remote = 'remote',
    Vacation = 'vacation',
    SickLeave = 'sick-leave',
    BusinessTrip = 'business-trip',
}

interface Props {
    id?: string | null;
}

export const WorkDayTypeIcon = ({ id }: Props) => {
    if (id === WorkDayType.BusinessTrip) {
        return <MdBusinessCenter />;
    }
    else if (id === WorkDayType.Office) {
        return <ImOffice />;
    }
    else if (id === WorkDayType.Remote) {
        return <FaLaptop />;
    }
    else if (id === WorkDayType.Vacation) {
        return <GiPalmTree />;
    }
    else if (id === WorkDayType.SickLeave) {
        return <FaTemperatureFull />;
    }
    else if (!id) {
        return <ImOffice />;
    }

    return <ImOffice />;
}