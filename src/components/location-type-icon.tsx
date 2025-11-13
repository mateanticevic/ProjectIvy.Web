import React from 'react';
import {
    IoMdHome,
    IoMdBriefcase,
    IoMdMore,
    IoMdAirplane,
    IoMdTrain,
    IoMdSchool,
    IoMdMedical,
    IoMdFilm,
    IoMdBasketball,
    IoMdCart,
    IoMdCafe,
    IoMdRestaurant,
    IoMdBook,
    IoMdBed,
    IoMdFitness,
} from 'react-icons/io';
import { 
    MdApartment,
    MdPark,
    MdTheaters,
    MdLocalPharmacy,
    MdSpa,
    MdStore,
    MdShoppingCart,
    MdLandscape,
    MdTerrain,
    MdMuseum,
} from 'react-icons/md';
import { 
    FaMountain, 
    FaShoppingBag,
    FaHiking,
    FaUmbrellaBeach,
} from 'react-icons/fa';
import { GiHomeGarage, GiMountainCave } from 'react-icons/gi';

interface Props {
    typeId?: string | null;
}

const LocationTypeIcon = ({ typeId }: Props) => {
    const getIcon = () => {
        switch (typeId) {
            case 'home':
                return <IoMdHome />;
            case 'work':
            case 'office':
                return <IoMdBriefcase />;
            case 'mountain-lodge':
                return <GiMountainCave />;
            case 'shopping-mall':
                return <MdShoppingCart />;
            case 'square':
                return <MdPark />;
            case 'mountain':
                return <FaMountain />;
            case 'mountain-peak':
                return <MdTerrain />;
            case 'wellness':
                return <MdSpa />;
            case 'retail-store':
                return <MdStore />;
            case 'apartment':
                return <MdApartment />;
            case 'museum':
                return <MdMuseum />;
            case 'climbing-gym':
                return <FaHiking />;
            case 'gym':
                return <IoMdFitness />;
            case 'restaurant':
                return <IoMdRestaurant />;
            case 'cafe':
                return <IoMdCafe />;
            case 'park':
                return <MdPark />;
            case 'beach':
                return <FaUmbrellaBeach />;
            case 'library':
                return <IoMdBook />;
            case 'hotel':
                return <IoMdBed />;
            case 'airport':
                return <IoMdAirplane />;
            case 'train-station':
                return <IoMdTrain />;
            case 'school':
                return <IoMdSchool />;
            case 'hospital':
                return <IoMdMedical />;
            case 'cinema':
                return <IoMdFilm />;
            case 'theater':
                return <MdTheaters />;
            case 'stadium':
                return <IoMdBasketball />;
            case 'supermarket':
                return <IoMdCart />;
            case 'pharmacy':
                return <MdLocalPharmacy />;
            case 'garage':
                return <GiHomeGarage />;
            case 'other':
            default:
                return <IoMdMore />;
        }
    };

    return getIcon();
};

export default LocationTypeIcon;
