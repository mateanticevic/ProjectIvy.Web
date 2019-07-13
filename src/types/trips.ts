export type Trip = {
    id: string;
    name: string;
    timestampEnd: Date;
    timestampStart: Date;
    distance: number;
    countries: any[];
    cities: any[];
    expenses: any[];
    pois?: any;
    totalSpent: number;
}