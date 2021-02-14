import { PaginationProps } from "react-bootstrap";
import { Currency } from "./expenses";
import { PagingFilters } from "./paging";

export interface Income {
    amount: number;
    currency: Currency;
    description: string;
    timestamp: string;
    type: IncomeType;
}

export interface IncomeBinding {
    amount: number;
    currencyId: string;
    date: string;
    description: string;
    sourceId: string;
    typeId: string;
}

export interface IncomeFilters extends PagingFilters {
    typeId: string;
}

export interface IncomeSource {
    id: string;
    name: string;
}

export interface IncomeType {
    id: string;
    name: string;
}