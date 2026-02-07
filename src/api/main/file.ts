import * as api from '../config';

function post(file): Promise<string> {
    return api.postFile('file?imageResize=0.4', file);
}

function deleteFile(file: string): Promise<number> {
    return api.del(`file/${file}`);
}

const file = {
    post,
    deleteFile,
};

export default file;
