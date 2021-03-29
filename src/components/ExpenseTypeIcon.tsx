import React from 'react';
import { BiDrink, BiRestaurant, BiTaxi } from 'react-icons/bi';
import { CgGames } from 'react-icons/cg';
import { MdBatteryFull, MdFlight } from 'react-icons/md';
import { FaParking, FaTv, FaShoppingBasket, FaCoffee, FaGasPump, FaWarehouse, FaUsb, FaCar, FaGlasses, FaMobile, FaRoad, FaBolt, FaFire, FaBuilding } from 'react-icons/fa';
import { GiCarWheel, GiFoodTruck, GiSonicShoes, GiHomeGarage } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';

const icons = {
    ['alcoholic-beverages']: <BiDrink />,
    ['batteries']: <MdBatteryFull />,
    ['building']: <FaBuilding />,
    ['cables']: <FaUsb />,
    ['car-rental']: <FaCar />,
    ['coffee']: <FaCoffee />,
    ['contact-lenses']: <FaGlasses />,
    ['car-maintenance']: <GiCarWheel />,
    ['games']: <CgGames />,
    ['gas']: <FaFire />,
    ['delivery']: <GoPackage />,
    ['drinks']: <BiDrink />,
    ['electricity']: <FaBolt />,
    ['house-repair']: <FaWarehouse />,
    ['house-supplies']: <FaWarehouse />,
    ['flight']: <MdFlight />,
    ['fuel']: <FaGasPump />,
    ['food-delivery']: <GiFoodTruck />,
    ['garage']: <GiHomeGarage />,
    ['groceries']: <FaShoppingBasket />,
    ['mobile-subscription']: <FaMobile />,
    ['parking']: <FaParking />,
    ['radiotelevision']: <FaTv />,
    ['restaurant']: <BiRestaurant />,
    ['shoes']: <GiSonicShoes />,
    ['taxi']: <BiTaxi />,
    ['toll']: <FaRoad />,
    ['tv']: <FaTv />,
};

interface Props {
    typeId: string
}

const ExpenseTypeIcon = ({ typeId }: Props) => icons[typeId] ?? <React.Fragment />;

export default ExpenseTypeIcon;