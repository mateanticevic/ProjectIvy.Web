import { filter } from 'lodash';
import * as api from '../config';
import { components } from 'types/ivy-types';

type Beer = components['schemas']['Beer'];
type BeerBrand = components['schemas']['BeerBrand'];

function get(filters) {
    return api.get('beer', filters);
}

function getBrands(filters?) {
    return api.get('beer/brand', filters ?? {});
}

const postBrand = (brand: BeerBrand) => api.post('beer/brand', brand);

function postBeer(brandId, beer) {
    return api.post(`beer/brand/${brandId}/beer`, beer);
}

const putBeer = (beerId: string, beer: Beer) => api.put(`beer/${beerId}`, beer);

const putBrand = (brandId: string, brand: BeerBrand) => api.put(`beer/brand/${brandId}`, brand);

const beer = {
    get,
    getBrands,
    postBrand,
    postBeer,
    putBeer,
    putBrand,
};

export default beer;
