import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type PoiBinding = components['schemas']['PoiBinding'];
type PoiPagedView = components['schemas']['PoiPagedView'];
type GetPoiQuery = paths['/Poi']['get']['parameters']['query'];

function get(filters?: GetPoiQuery): Promise<PoiPagedView> {
    return api.get('poi', filters);
}

function post(poi: PoiBinding): Promise<number> {
    return api.post('poi', poi);
}

const poi = {
    get,
    post,
};

export default poi;
