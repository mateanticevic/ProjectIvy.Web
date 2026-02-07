import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type RideBinding = components['schemas']['RideBinding'];
type GetRideQuery = paths['/Ride']['get']['parameters']['query'];

const get = (filters?: GetRideQuery) => api.get('ride', filters);

const post = (ride: RideBinding): Promise<number> => api.post('ride', ride);

const ride = {
    get,
    post,
};

export default ride;
