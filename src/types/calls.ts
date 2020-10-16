export interface Call {
    duration: number;
    file: any;
    id: string;
    number: number;
    timestamp: string;
    person?: Person;
}

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
}
