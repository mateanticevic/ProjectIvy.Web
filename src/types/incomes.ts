import { PagingFilters } from './paging';

export interface IncomeFilters extends PagingFilters {
    currencyId?: string;
    from?: string;
    sourceId?: string;
    to?: string;
    typeId?: string;
}