import { Currency } from './expenses';

export interface User {
    defaultCurrency: Currency;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}
