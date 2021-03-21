import React from 'react';
import { BiDrink, BiRestaurant, BiTaxi } from 'react-icons/bi';
import { CgGames } from 'react-icons/cg';
import { MdBatteryFull, MdFlight } from 'react-icons/md';
import { FaParking, FaTv, FaShoppingBasket, FaCoffee, FaGasPump } from 'react-icons/fa';
import { GiCarWheel, GiFoodTruck } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';

const icons = {
    ['alcoholic-beverages']: <BiDrink />,
    ['batteries']: <MdBatteryFull />,
    ['coffee']: <FaCoffee />,
    ['car-maintenance']: <GiCarWheel />,
    ['games']: <CgGames />,
    ['delivery']: <GoPackage />,
    ['drinks']: <BiDrink />,
    ['flight']: <MdFlight />,
    ['fuel']: <FaGasPump />,
    ['food-delivery']: <GiFoodTruck />,
    ['groceries']: <FaShoppingBasket />,
    ['parking']: <FaParking />,
    ['restaurant']: <BiRestaurant />,
    ['taxi']: <BiTaxi />,
    ['tv']: <FaTv />,
};

interface Props {
    typeId: string
}

const ExpenseTypeIcon = ({ typeId }: Props) => icons[typeId] ?? <React.Fragment />;

export default ExpenseTypeIcon;