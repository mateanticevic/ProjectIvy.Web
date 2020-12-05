import { Country } from './common';
import { Currency } from './expenses';

export interface User {
    defaultCurrency: Currency;
    email: string;
    firstName: string;
    lastName: string;
    modules: string[];
    username: string;
}

export interface UserSession {
    country: Country;
    id: string;
    ipAddress: string;
    operatingSystem: string;
    userAgent: string;
    validUntil: string;
}