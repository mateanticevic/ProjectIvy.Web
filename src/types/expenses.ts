import { Name } from './common';

export interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
}

export interface Expense {
    amount: number;
    card: { id: string, name: string };
    comment: string;
    currency: Currency;
    date: string;
    datePaid: string;
    expenseType: ExpenseType;
    files: [];
    id: string;
    installmentRef: string;
    modified: string;
    needsReview: boolean;
    parentAmount?: number;
    parentCurrency: Currency;
    parentCurrencyExchangeRate?: number;
    paymentType: Name;
    poi: any;
    timestamp: string;
    vendor: Vendor;
}

export interface ExpenseBinding {
    amount: number;
    cardId?: string;
    comment: string;
    currencyId: string;
    date: string;
    datePaid: string;
    expenseTypeId: string;
    id: string;
    installmentRef: string;
    modified: string;
    paymentTypeId: string;
    parentAmount?: number;
    parentCurrencyExchangeRate?: number;
    parentCurrencyId?: string;
    poiId?: string;
    timestamp: string;
    vendorId?: string;
}

export interface ExpenseFileType {
    id: string;
    name: string;
}

export interface ExpenseFile {
    type?: ExpenseFileType;
    typeId: string;
    name: string;
}

export interface ExpenseFilters {
    from?: string;
    to?: string;
    page: number;
    pageSize: number;
}

export interface ExpenseType {
    id: string;
    name: string;
}

export interface Vendor {
    id: string;
    name: string;
    city: any;
}

export interface AmountInCurrency {
    key: Currency;
    value: number;
}
