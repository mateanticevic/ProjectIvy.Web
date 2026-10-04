import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type TrackingView = components['schemas']['TrackingView'];
type TrackingViewBinding = components['schemas']['TrackingViewBinding'];
type GetTrackingViewPath = paths['/TrackingView/{id}']['get']['parameters']['path'];
type PutTrackingViewPath = paths['/TrackingView/{id}']['put']['parameters']['path'];
type DeleteTrackingViewPath = paths['/TrackingView/{id}']['delete']['parameters']['path'];

const get = (): Promise<TrackingView[]> => api.get('trackingview');

const getById = (id: GetTrackingViewPath['id']): Promise<TrackingView> => api.get(`trackingview/${id}`);

const post = (trackingView: TrackingViewBinding): Promise<TrackingView> => api.post('trackingview', trackingView);

const put = (id: PutTrackingViewPath['id'], trackingView: TrackingViewBinding): Promise<number> => api.put(`trackingview/${id}`, trackingView);

const del = (id: DeleteTrackingViewPath['id']): Promise<number> => api.del(`trackingview/${id}`);

const trackingView = {
    get,
    getById,
    post,
    put,
    del,
};

export default trackingView;
