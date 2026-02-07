import * as api from '../config';
import { paths, components } from 'types/ivy-types';

type BrandPagedView = components['schemas']['BrandPagedView'];
type BrandQuery = paths['/Brand']['get']['parameters']['query'];

const get = (query?: BrandQuery): Promise<BrandPagedView> => api.get('brand', query ?? {});

const brand = {
    get,
};

export default brand;
