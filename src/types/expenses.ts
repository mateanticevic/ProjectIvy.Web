export interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
}

export interface ExpenseFilters {
    from?: string;
    to?: string;
    page: number;
    pageSize: number;
}

export interface AmountInCurrency {
    key: Currency;
    value: number;
}
