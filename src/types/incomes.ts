import { PagingFilters } from './paging';

export interface IncomeFilters extends PagingFilters {
    from?: string;
    to?: string;
    typeId?: string;
}