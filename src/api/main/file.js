import * as api from '../config';

export function post(file) {
    return api.postFile("file", file);
}