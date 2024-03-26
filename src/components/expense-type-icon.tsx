import React from 'react';
import { BiDrink, BiRestaurant, BiTaxi, BiDollar, BiCameraMovie, BiSolidTShirt } from 'react-icons/bi';
import { BsMotherboard } from 'react-icons/bs';
import { CgGames } from 'react-icons/cg';
import { FaHamburger, FaMemory } from 'react-icons/fa';
import { FiCpu, FiPower } from 'react-icons/fi';
import { FcInspection } from 'react-icons/fc';
import { FaFerry } from 'react-icons/fa6';
import { GiPresent, GiClothes } from 'react-icons/gi';
import { MdBatteryFull, MdFlight, MdCarRepair } from 'react-icons/md';
import { FaCouch, FaParking, FaTv, FaShoppingBasket, FaCoffee, FaGasPump, FaWarehouse, FaUsb, FaCar, FaGlasses, FaMobile, FaRoad, FaBolt, FaFire, FaBuilding, FaTooth } from 'react-icons/fa';
import { GiCarWheel, GiFoodTruck, GiSonicShoes, GiHomeGarage, GiDeliveryDrone } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';
import { IoMdTrain } from 'react-icons/io';

const icons = {
    ['alcoholic-beverages']: <BiDrink />,
    ['batteries']: <MdBatteryFull />,
    ['building']: <FaBuilding />,
    ['cables']: <FaUsb />,
    ['car-inspection']: <FcInspection />,
    ['car-maintenance']: <GiCarWheel />,
    ['car-parts']: <GiCarWheel />,
    ['car-registration']: <FaCar />,
    ['car-rental']: <FaCar />,
    ['car-repair']: <MdCarRepair />,
    ['cinema']: <BiCameraMovie />,
    ['clothes-other']: <GiClothes />,
    ['coffee']: <FaCoffee />,
    ['contact-lenses']: <FaGlasses />,
    ['delivery']: <GoPackage />,
    ['dentist']: <FaTooth />,
    ['drinks']: <BiDrink />,
    ['drone']: <GiDeliveryDrone />,
    ['electricity']: <FaBolt />,
    ['fast-food']: <FaHamburger />,
    ['flight']: <MdFlight />,
    ['ferry']: <FaFerry />,
    ['furniture']: <FaCouch />,
    ['food-delivery']: <GiFoodTruck />,
    ['fuel']: <FaGasPump />,
    ['games']: <CgGames />,
    ['garage']: <GiHomeGarage />,
    ['gas']: <FaFire />,
    ['groceries']: <FaShoppingBasket />,
    ['house-repair']: <FaWarehouse />,
    ['house-supplies']: <FaWarehouse />,
    ['mobile-subscription']: <FaMobile />,
    ['motherboard']: <BsMotherboard />,
    ['parking']: <FaParking />,
    ['power-supply']: <FiPower />,
    ['present']: <GiPresent />,
    ['processor']: <FiCpu />,
    ['radiotelevision']: <FaTv />,
    ['ram-memory']: <FaMemory />,
    ['restaurant']: <BiRestaurant />,
    ['shoes']: <GiSonicShoes />,
    ['shirt']: <BiSolidTShirt />,
    ['taxi']: <BiTaxi />,
    ['train']: <IoMdTrain />,
    ['toll']: <FaRoad />,
    ['traffic-fine']: <FaCar />,
    ['tv']: <FaTv />,
};

interface Props {
    typeId: string
}

const ExpenseTypeIcon = ({ typeId }: Props) => icons[typeId] ?? <BiDollar />;

export default ExpenseTypeIcon;