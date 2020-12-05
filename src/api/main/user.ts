import { User } from 'types/users';
import * as api from '../config';

const deleteSession = (sessionId: string) => api.del(`user/session/${sessionId}`);

function get(): Promise<User> {
    return api.get('user');
}

const getSessions = () => api.get('user/session');

const user = {
    deleteSession,
    get,
    getSessions,
};

export default user;
