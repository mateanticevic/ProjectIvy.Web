import ExpenseCountGraph from 'src/pages/expenses/ExpenseCountGraph';

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
    expenseType: ExpenseType;
    files: [];
    id: string;
    modified: string;
    needsReview: boolean;
    parentCurrency: Currency;
    parentCurrencyExchangeRate?: number;
    paymentType: { id: string, name: string };
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
    expenseTypeId: string;
    id: string;
    modified: string;
    paymentTypeId: string;
    parentCurrencyExchangeRate?: number,
    parentCurrencyId?: string;
    poiId?: string;
    timestamp: string;
    vendorId?: string;
}

export interface ExpenseType {
    id: string;
    icon: string;
    name: string;
}

export interface Vendor {
    id: string;
    name: string;
    city: any;
}
