export interface PagingFilters {
    page: number;
    pageSize: number;
}

export interface PagedItems<T> {
    count: number;
    items: T[];
}

export const defaultPagingFilters: PagingFilters = {
    page: 1,
    pageSize: 10,
};
