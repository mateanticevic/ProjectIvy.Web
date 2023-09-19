import { Country } from './common';

export interface CountryListVisited {
    id: string;
    name: string;
    countriesNotVisited: Country[];
    countriesVisited: Country[];
}

export interface TripFilters {
    from: string;
    to: string;
    cityId: string[];
    countryId: string[];
    page: number;
    pageSize: number;
}
