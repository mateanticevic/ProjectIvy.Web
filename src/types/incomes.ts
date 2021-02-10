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

export interface IncomeFilters extends PagingFilters {
}

export interface IncomeSource {
    id: string;
    name: string;
}

export interface IncomeType {
    id: string;
    name: string;
}