import * as api from '../config';
import { User } from 'types/users';
import { paths, components } from 'types/ivy-types';

type GetUserWeightQuery = paths['/User/Weight']['get']['parameters']['query'];
type DateTimeDecimalKeyValuePair = components['schemas']['DateTimeDecimalKeyValuePair'];

const deleteSession = (sessionId?: string): Promise<number> => api.del(sessionId ? `user/session/${sessionId}` : 'user/session');

function get(): Promise<User> {
    return api.get('user', null, 4000);
}

const getSessions = () => api.get('user/session');

const getWeight = (filters?: GetUserWeightQuery): Promise<DateTimeDecimalKeyValuePair[]> => api.get('user/weight', filters);

const user = {
    deleteSession,
    get,
    getSessions,
    getWeight,
};

export default user;
