export type PagingFilters = {
    page: number,
    pageSize: number
}

export type PagedItems<T> = {
    count: number,
    items: T[] 
}