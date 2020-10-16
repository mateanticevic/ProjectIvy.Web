import { PagingFilters, defaultPagingFilters } from './paging';
import moment from 'moment';

export interface Beer {
    abv?: number;
    brandId?: string;
    id?: string;
    name?: string;
    styleId?: string;
    style?: Style;
}

export interface Brand {
    id: string;
    name: string;
    countryId: string;
}

export interface BrandFilters {
    hasCountry?: boolean;
    search?: string;
}

export interface Consumation {
    date: string;
    beer: Beer;
    beerId: string;
    servingId: string;
    units: number;
    volume: number;
}

export const defaultConsumation: Consumation = {
    date: moment().format('YYYY-MM-DD'),
};

export type ConsumationFilters = PagingFilters & {
    from?: string,
    to?: string,
    beerId?: string[],
    brandId?: string,
    countryId?: string,
    servingId?: string,
    styleId?: string[],
};

export const defaultConsumationFilters: ConsumationFilters = {
    ...defaultPagingFilters
};

export interface Serving {
    id: string;
    name: string;
}

export interface Style {
    id: string;
    name: string;
}