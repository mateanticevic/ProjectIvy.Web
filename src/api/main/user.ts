import * as api from '../config';
import { User } from 'types/users';

function get(): Promise<User> {
    return api.get("user");
}

const userApi = {
    get
}

export default userApi;
