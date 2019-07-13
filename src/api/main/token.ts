import * as api from '../config';

export function post(username: string, password: string): Promise<string> {
    return api.post(`token?username=${username}&password=${password}`);
}