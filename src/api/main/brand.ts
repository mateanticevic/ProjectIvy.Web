import * as api from '../config';
import { paths } from 'types/ivy-types';

type BrandQuery = paths['/Brand']['get']['parameters']['query'];

const get = (query?: BrandQuery) => api.get('brand', query ?? {});

const brand = {
    get,
};

export default brand;
