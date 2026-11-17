import { PagingFilters } from './paging';

export interface IncomeFilters extends PagingFilters {
    currencyId?: string;
    from?: string;
    hasTransactions?: boolean;
    linkedToSalary?: boolean;
    sourceId?: string;
    to?: string;
    typeId?: string;
}
