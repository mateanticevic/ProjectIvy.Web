export interface PagedList<Item> {
    count: number,
    items: Item[]
}

export interface PagedItems<Item> {
    list: PagedList<Item>,
    page: number,
    pageSize: number
}

export type FileType = {
    id: string,
    name: string,
    mimeType: string
}

export type File = {
    id: string,
    size: number,
    created: string,
    type: FileType
}

export type Vendor = {
    id: string,
    name: string
}