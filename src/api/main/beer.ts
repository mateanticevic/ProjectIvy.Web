import * as api from '../config';

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

const beer = {
    get,
    getBrands,
    postBrand,
    postBeer,
};

export default beer;
