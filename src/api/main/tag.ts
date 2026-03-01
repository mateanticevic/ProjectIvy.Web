import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type TagBinding = components['schemas']['TagBinding'];
type TagPagedView = components['schemas']['TagPagedView'];
type GetTagQuery = paths['/Tag']['get']['parameters']['query'];

const get = (filters?: GetTagQuery): Promise<TagPagedView> => api.get('tag', filters);

const post = (data: TagBinding): Promise<number> => api.post('tag', data);

const tag = {
    get,
    post,
};

export default tag;
