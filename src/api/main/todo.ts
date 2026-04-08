import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type ToDoBinding = components['schemas']['ToDoBinding'];
type ToDoPagedView = components['schemas']['ToDoPagedView'];
type TagInt32KeyValuePair = components['schemas']['TagInt32KeyValuePair'];
type TagCurrencyDecimalKeyValuePairIEnumerableKeyValuePair = components['schemas']['TagCurrencyDecimalKeyValuePairIEnumerableKeyValuePair'];
type TripInt32KeyValuePair = components['schemas']['TripInt32KeyValuePair'];
type GetToDoQuery = paths['/ToDo']['get']['parameters']['query'];
type GetToDoCountByTagQuery = paths['/ToDo/Count/ByTag']['get']['parameters']['query'];
type GetToDoCountByTripQuery = paths['/ToDo/Count/ByTrip']['get']['parameters']['query'];
type GetToDoSumByTagQuery = paths['/ToDo/Sum/ByTag']['get']['parameters']['query'];
type PutToDoPath = paths['/ToDo/{id}']['put']['parameters']['path'];
type DeleteToDoPath = paths['/ToDo/{id}']['delete']['parameters']['path'];

type ToDoQueryWithTrip = NonNullable<GetToDoQuery> & { TripId?: string[] };
type GetToDoCountByTagQueryWithTrip = NonNullable<GetToDoCountByTagQuery> & { TripId?: string[] };
type GetToDoCountByTripQueryWithTrip = NonNullable<GetToDoCountByTripQuery> & { TripId?: string[] };
type GetToDoSumByTagQueryWithTrip = NonNullable<GetToDoSumByTagQuery> & { TripId?: string[] };

const get = (filters?: ToDoQueryWithTrip): Promise<ToDoPagedView> => api.get('todo', filters as GetToDoQuery);

const getCountByTag = (filters?: GetToDoCountByTagQueryWithTrip): Promise<TagInt32KeyValuePair[]> => api.get('todo/count/bytag', filters as GetToDoCountByTagQuery);

const getCountByTrip = (filters?: GetToDoCountByTripQueryWithTrip): Promise<TripInt32KeyValuePair[]> => api.get('todo/count/bytrip', filters as GetToDoCountByTripQuery);

const getSumByTag = (filters?: GetToDoSumByTagQueryWithTrip): Promise<TagCurrencyDecimalKeyValuePairIEnumerableKeyValuePair[]> => api.get('todo/sum/bytag', filters as GetToDoSumByTagQuery);

const post = (todo: ToDoBinding): Promise<number> => api.post('todo', todo);

const put = (id: PutToDoPath['id'], todo: ToDoBinding): Promise<number> => api.put(`todo/${id}`, todo);

const deleteToDo = (id: DeleteToDoPath['id']): Promise<number> => api.del(`todo/${id}`);

const postTag = (id: string, tagId: string): Promise<number> => api.post(`todo/${id}/tag/${tagId}`);

const deleteTag = (id: string, tagId: string): Promise<number> => api.del(`todo/${id}/tag/${tagId}`);

const todo = {
    get,
    getCountByTag,
    getCountByTrip,
    getSumByTag,
    post,
    put,
    deleteToDo,
    postTag,
    deleteTag,
};

export default todo;
