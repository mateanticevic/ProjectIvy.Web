import * as api from '../config';
import { Brand } from 'types/beer';

function get(filters) {
    return api.get('beer', filters);
}

function getBrands() {
    return api.get('beer/brand');
}

function postBrand(name) {
    return api.post('beer/brand', name);
}

function postBeer(brandId, beer) {
    return api.post(`beer/brand/${brandId}/beer`, beer);
}

const putBrand = (brandId: string, brand: Brand) => api.put(`beer/brand/${brandId}`, brand);

const beer = {
    get,
    getBrands,
    postBrand,
    postBeer,
    putBrand,
};

export default beer;
