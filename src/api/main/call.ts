import * as api from '../config';
import { paths } from 'types/ivy-types';

type GetCallQuery = paths['/Call']['get']['parameters']['query'];

export function get(filters?: GetCallQuery) {
    return api.get('call', filters);
}

const call = {
    get,
};

export default call;
