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

export type Vendor = {
    id: string,
    name: string
}

export interface Name {
    id: string;
    name: string;
}

export interface UploadedFile {
    id: string;
    file: File;
}

export interface Country {
    id: string;
    name: string;
}
