import { components } from 'types/ivy-types';

// The Fuel GET actions return these backend views without response schemas in OpenAPI.
export interface CarFueling {
    amountInLiters: number;
    date: string;
}

export type CarFuelTotal = Required<components['schemas']['Int32DecimalKeyValuePair']>;
