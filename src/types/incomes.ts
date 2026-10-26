import { PagingFilters } from './paging';

export interface IncomeFilters extends PagingFilters {
    currencyId?: string;
    from?: string;
    linkedToSalary?: boolean;
    sourceId?: string;
    to?: string;
    typeId?: string;
}
