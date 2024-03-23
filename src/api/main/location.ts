import * as api from '../config';

import { components } from 'types/ivy-types';
import { paths } from 'types/ivy-types';

type LocationBinding = components['schemas']['LocationBinding'];
type Filter = paths['/Location']['get']['parameters']['query'];

const get = (filter: Filter) => api.get('location', filter);

const getByDay = (from: string, to: string) => api.get('location/byday', { from, to });

const getDays = (locationId) => api.get(`location/${locationId}/days`);

const getTypes = () => api.get('location/types');

const post = (location: LocationBinding) => api.post('location', location);

const location = {
    get,
    getByDay,
    getDays,
    getTypes,
    post,
};

export default location;
