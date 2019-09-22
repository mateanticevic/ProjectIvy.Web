import * as api from '../config';

function post(file) {
    return api.postFile("file", file);
}

function deleteFile(file) {
    return api.del(`file/${file}`);
}

const file = {
    post,
    deleteFile
}

export default file;