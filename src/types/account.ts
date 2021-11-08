import { Currency } from './expenses';

export interface Account {
    id: string;
    name: string;
    bank?: Bank;
    balance: number;
    currency: Currency;
}

export interface Bank {
    id: string;
    name: string;
}