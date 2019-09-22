import * as api from '../config';

function post(username: string, password: string): Promise<string> {
    return api.post(`token?username=${username}&password=${password}`);
}

const token = {
    post
}

export default token;
