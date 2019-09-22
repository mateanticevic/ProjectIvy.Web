export interface PagingFilters {
    page: number;
    pageSize: number;
}

export interface PagedItems<T> {
    count: number;
    items: T[];
}
