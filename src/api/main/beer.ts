import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type Beer = components['schemas']['Beer'];
type BeerBrand = components['schemas']['BeerBrand'];
type BeerBinding = components['schemas']['BeerBinding'];
type GetBeerQuery = paths['/Beer']['get']['parameters']['query'];
type GetBeerBrandQuery = paths['/Beer/Brand']['get']['parameters']['query'];

function get(filters?: GetBeerQuery) {
    return api.get('beer', filters);
}

function getBrands(filters?: GetBeerBrandQuery) {
    return api.get('beer/brand', filters ?? {});
}

const postBrand = (brand: BeerBrand): Promise<number> => api.post('beer/brand', brand);

function postBeer(brandId: string, beer: BeerBinding): Promise<number> {
    return api.post(`beer/brand/${brandId}/beer`, beer);
}

const putBeer = (beerId: string, beer: Beer): Promise<number> => api.put(`beer/${beerId}`, beer);

const putBrand = (brandId: string, brand: BeerBrand): Promise<number> => api.put(`beer/brand/${brandId}`, brand);

const beer = {
    get,
    getBrands,
    postBrand,
    postBeer,
    putBeer,
    putBrand,
};

export default beer;
