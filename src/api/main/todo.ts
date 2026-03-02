import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type ToDoBinding = components['schemas']['ToDoBinding'];
type ToDoPagedView = components['schemas']['ToDoPagedView'];
type GetToDoQuery = paths['/ToDo']['get']['parameters']['query'];
type PutToDoPath = paths['/ToDo/{id}']['put']['parameters']['path'];

const get = (filters?: GetToDoQuery): Promise<ToDoPagedView> => api.get('todo', filters);

const post = (todo: ToDoBinding): Promise<number> => api.post('todo', todo);

const put = (id: PutToDoPath['id'], todo: ToDoBinding): Promise<number> => api.put(`todo/${id}`, todo);

const postTag = (id: string, tagId: string): Promise<number> => api.post(`todo/${id}/tag/${tagId}`);

const deleteTag = (id: string, tagId: string): Promise<number> => api.del(`todo/${id}/tag/${tagId}`);

const todo = {
    get,
    post,
    put,
    postTag,
    deleteTag,
};

export default todo;
