import { User } from 'types/users';
import * as api from '../config';

const deleteSession = (sessionId?: string) => api.del(sessionId ? `user/session/${sessionId}` : 'user/session');

function get(): Promise<User> {
    return api.get('user', null, 4000);
}

const getSessions = () => api.get('user/session');

const getWeight = () => api.get('user/weight?from=2020-1-1');

const user = {
    deleteSession,
    get,
    getSessions,
    getWeight,
};

export default user;
