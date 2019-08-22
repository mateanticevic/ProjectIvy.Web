import * as api from '../config';

export function getCalls(filters) {
    return api.get('call', filters);
}