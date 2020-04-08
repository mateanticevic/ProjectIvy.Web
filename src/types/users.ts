import { Currency } from './expenses';

export interface User {
    defaultCurrency: Currency;
    email: string;
    firstName: string;
    lastName: string;
    modules: string[];
    username: string;
}
