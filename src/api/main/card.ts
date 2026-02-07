import * as api from '../config';
import { paths } from 'types/ivy-types';

type GetCardQuery = paths['/Card']['get']['parameters']['query'];

function get(filters?: GetCardQuery) {
    return api.get('card', filters);
}

const card = {
    get,
};

export default card;
