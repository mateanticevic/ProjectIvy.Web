import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type ToDoBinding = components['schemas']['ToDoBinding'];
type ToDoPagedView = components['schemas']['ToDoPagedView'];
type TagInt32KeyValuePair = components['schemas']['TagInt32KeyValuePair'];
type GetToDoQuery = paths['/ToDo']['get']['parameters']['query'];
type PutToDoPath = paths['/ToDo/{id}']['put']['parameters']['path'];

const get = (filters?: GetToDoQuery): Promise<ToDoPagedView> => api.get('todo', filters);

const getCountByTag = (): Promise<TagInt32KeyValuePair[]> => api.get('todo/count/bytag');

const post = (todo: ToDoBinding): Promise<number> => api.post('todo', todo);

const put = (id: PutToDoPath['id'], todo: ToDoBinding): Promise<number> => api.put(`todo/${id}`, todo);

const postTag = (id: string, tagId: string): Promise<number> => api.post(`todo/${id}/tag/${tagId}`);

const deleteTag = (id: string, tagId: string): Promise<number> => api.del(`todo/${id}/tag/${tagId}`);

const todo = {
    get,
    getCountByTag,
    post,
    put,
    postTag,
    deleteTag,
};

export default todo;
