import { components, paths } from 'types/ivy-types';

import * as api from '../config';

type AirportPagedView = components['schemas']['AirportPagedView'];
type GetAirportQuery = paths['/Airport']['get']['parameters']['query'];

const get = (filters?: GetAirportQuery): Promise<AirportPagedView> => api.get('airport', filters);

const airport = {
    get,
};

export default airport;