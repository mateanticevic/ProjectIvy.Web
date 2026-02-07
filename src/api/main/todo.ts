import * as api from '../config';

interface TodoFilters {
    From?: string;
    To?: string;
    OrderAscending?: boolean;
}

interface Todo {
    id?: string;
    description?: string;
    created?: string;
    done?: boolean;
}

function get(filters?: TodoFilters): Promise<Todo[]> {
    return api.get('todo', filters);
}

function post(todo: Todo): Promise<number> {
    return api.post('todo', todo);
}

function postDone(id: string): Promise<number> {
    return api.post(`todo/${id}/done`);
}

const todo = {
    get,
    post,
    postDone,
};

export default todo;
