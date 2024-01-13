import * as api from '../config';

import { paths } from 'types/ivy-types';

type Filter = paths['/Route']['get']['parameters'];

const get = (filter: Filter) => api.get('route', filter);

const getPoints = (id: string) => api.get(`route/${id}/points`);

const route = {
    get,
    getPoints,
};

export default route;
