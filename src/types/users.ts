import { Car } from './car';
import { Country } from './common';
import { Currency } from './expenses';

export interface User {
    defaultCar?: Car; 
    defaultCurrency: Currency;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface UserSession {
    country: Country;
    id: string;
    ipAddress: string;
    isCurrentSession: boolean;
    operatingSystem: string;
    userAgent: string;
    validUntil: string;
}

export enum Feature {
    Beer = 'beer',
    Calls = 'calls',
    Cars = 'cars',
    Finance = 'finance',
    Movies = 'movies',
    Tracking = 'tracking',
    Travel = 'travel',
}

export interface Identity {
    name: string;
    pif: Feature[]
}