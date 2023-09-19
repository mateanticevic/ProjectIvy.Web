import { PagingFilters, defaultPagingFilters } from './paging';
import moment from 'moment';

import { components } from 'types/ivy-types';

type Consumation = components['schemas']['Consumation'];

export interface BrandFilters {
    hasCountry?: boolean;
    search?: string;
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
