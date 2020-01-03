import { File } from '../common';

export type ExpenseFileType = {
    id: string,
    name: string
}

export type ExpenseFile = {
    type: ExpenseFileType,
    name: string,
    file: File
}

export type ExpenseFilters = {
    from: string,
    to: string,
}