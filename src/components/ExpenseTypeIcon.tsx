import React from 'react';
import { BiDrink } from 'react-icons/bi';
import { CgGames } from 'react-icons/cg';
import { FaParking, FaTv, FaShoppingBasket } from 'react-icons/fa';
import { GiCarWheel, GiFoodTruck } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';

const icons = {
    ['alcoholic-beverages']: <BiDrink />,
    ['car-maintenance']: <GiCarWheel />,
    ['games']: <CgGames />,
    ['delivery']: <GoPackage />,
    ['drinks']: <BiDrink />,
    ['food-delivery']: <GiFoodTruck />,
    ['groceries']: <FaShoppingBasket />,
    ['parking']: <FaParking />,
    ['tv']: <FaTv />,
};

interface Props {
    typeId: string
}

const ExpenseTypeIcon = ({ typeId }: Props) => icons[typeId] ?? <React.Fragment />;

export default ExpenseTypeIcon;