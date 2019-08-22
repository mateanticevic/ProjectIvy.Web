export type Call = {
    duration: number,
    file: any,
    id: string,
    number: number,
    timestamp: string,
    person?: Person
}

export type Person = {
    id: string,
    firstName: string,
    lastName: string
}