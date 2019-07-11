import * as api from '../config';

export function post(file) {
    return api.postFile("file", file);
}

export function deleteFile(file) {
    return api.del(`file/${file}`);
}