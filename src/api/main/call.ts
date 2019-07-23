import * as api from '../config';

export function getCalls() {
    return api.get('call');
}