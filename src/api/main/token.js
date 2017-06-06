import * as api from '../config';

export function post(credentials) {
    return api.post("token", credentials);
}