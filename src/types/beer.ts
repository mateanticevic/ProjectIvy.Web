import { PagingFilters } from './paging';

export interface Beer {
    abv: number;
    brandId: string;
    id: string;
}

export interface Brand {
    id: string;
    name: string;
}

export interface Consumation {
    date: string;
    beerId: string;
    servingId: string;
    units: number;
    volume: number;
}

export type ConsumationFilters = PagingFilters & {
    from?: string,
    to?: string,
    brandId?: string,
    servingId?: string,
};

export interface Serving {
    id: string;
    name: string;
}

export interface Style {
    id: string;
    name: string;
}