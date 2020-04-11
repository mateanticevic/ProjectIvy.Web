import * as api from '../config';

function post(file): Promise<string> {
    return api.postFile('file', file);
}

function deleteFile(file) {
    return api.del(`file/${file}`);
}

const file = {
    post,
    deleteFile,
};

export default file;
