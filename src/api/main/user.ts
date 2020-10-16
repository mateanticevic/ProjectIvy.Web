import { User } from 'types/users';
import * as api from '../config';

function get(): Promise<User> {
    return api.get('user');
}

const user = {
    get,
};

export default user;
