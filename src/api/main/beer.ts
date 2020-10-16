import * as api from '../config';
import { Brand, Beer } from 'types/beer';

function get(filters) {
    return api.get('beer', filters);
}

function getBrands(filters?) {
    return api.get('beer/brand', filters ?? {});
}

const postBrand = (brand: Brand) => api.post('beer/brand', brand);

function postBeer(brandId, beer) {
    return api.post(`beer/brand/${brandId}/beer`, beer);
}

const putBeer = (beerId: string, beer: Beer) => api.put(`beer/${beerId}`, beer);

const putBrand = (brandId: string, brand: Brand) => api.put(`beer/brand/${brandId}`, brand);

const beer = {
    get,
    getBrands,
    postBrand,
    postBeer,
    putBeer,
    putBrand,
};

export default beer;
